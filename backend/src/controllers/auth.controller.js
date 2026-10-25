import userModel from "../models/user.model.js";
import blacklistedTokenModel from "../models/blacklist.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { uploadAvatarImage, getPresignedAvatarUrl } from "../services/s3.service.js";
import emailService from "../services/emailService.js";
import crypto from "crypto";

const client = new OAuth2Client();

const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000 // 1 day
};

/**
 * Format user object for API responses.
 * Converts S3 object key stored in user.avatar into a temporary presigned GET URL.
 */
async function formatUserResponse(userDoc) {
    if (!userDoc) return null;
    const userObj = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
    delete userObj.password;

    if (userObj.avatar) {
        userObj.avatar = await getPresignedAvatarUrl(userObj.avatar);
    }
    return userObj;
}

/**
 * Generate a cryptographically secure 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
function generateOTP() {
    // Generate a random number between 100000 and 999999
    return crypto.randomInt(100000, 999999).toString().padStart(6, '0');
}

/**
 * Hash OTP using bcrypt (same as password hashing)
 * @param {string} otp - Plain OTP
 * @returns {Promise<string>} - Hashed OTP
 */
async function hashOTP(otp) {
    const saltRounds = 10;
    return await bcrypt.hash(otp, saltRounds);
}

/**
 * Verify OTP against hashed version
 * @param {string} otp - Plain OTP
 * @param {string} hashedOTP - Hashed OTP from database
 * @returns {Promise<boolean>} - Verification result
 */
async function verifyOTPToken(otp, hashedOTP) {
    return await bcrypt.compare(otp, hashedOTP);
}

/**
 * Register a new user (initiates OTP verification)
 */
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await userModel.findOne({
            $or: [{ username }, { email: normalizedEmail }]
        });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 13);
        const newUser = await userModel.create({
            username,
            email: normalizedEmail,
            password: hashedPassword,
            isVerified: false, // Email not verified yet
            verificationToken: "", // Will be set after OTP generation
            verificationExpires: null,
            verificationAttempts: 0
        });

        // Generate and hash OTP
        const otp = generateOTP();
        const hashedOTP = await hashOTP(otp);

        // Store OTP hash and set expiration (5 minutes from now)
        const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || 5) * 60 * 1000);
        newUser.verificationToken = hashedOTP;
        newUser.verificationExpires = expiresAt;
        newUser.verificationAttempts = 0;
        newUser.lastOtpSentAt = new Date();
        await newUser.save();

        // Send OTP email
        const emailSent = await emailService.sendOTPEmail(normalizedEmail, otp, username);
        if (!emailSent) {
            // Clean up user if email fails so user can retry cleanly
            await userModel.deleteOne({ _id: newUser._id });
            return res.status(500).json({
                message: "Failed to send verification email. Please try again."
            });
        }

        // Return user data for frontend to initiate OTP verification
        return res.status(201).json({
            message: "Registration initiated. Please check your email for the verification code.",
            user: {
                _id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                isVerified: false
            }
        });
    } catch (error) {
        console.error("Register Error:", error.message);
        return res.status(500).json({
            message: "Error creating user"
        });
    }
};

/**
 * Login existing user
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await userModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        // Check if email is verified
        if (user.isVerified === false) {
            return res.status(403).json({
                message: "Please verify your email before logging in.",
                isVerified: false,
                email: user.email,
                user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    isVerified: false
                }
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, cookieOptions);

        const formattedUser = await formatUserResponse(user);
        return res.status(200).json({
            message: "User logged in successfully",
            token,
            user: formattedUser
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        return res.status(500).json({
            message: "Login failed"
        });
    }
};

/**
 * Logout user
 */
const logoutUser = async (req, res) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers?.authorization) {
            const parts = req.headers.authorization.split(" ");
            if (parts.length === 2 && (parts[0] === "Bearer" || parts[0] === "bearer")) {
                token = parts[1];
            } else {
                token = req.headers.authorization;
            }
        }

        res.clearCookie("token", cookieOptions);
        if (token) {
            await blacklistedTokenModel.create({ token });
        }

        return res.status(200).json({
            message: "User logged out successfully"
        });

    } catch (err) {
        console.error("Logout Error:", err.message);
        return res.status(500).json({
            message: "Error logging out user"
        });
    }
};

/**
 * Get current logged-in user
 */
const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const formattedUser = await formatUserResponse(user);
        return res.status(200).json({
            message: "User found",
            user: formattedUser
        });

    } catch (err) {
        console.error("getCurrentUser Error:", err.message);
        return res.status(500).json({
            message: "Error getting user profile"
        });
    }
};

/**
 * Update user profile information
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.decoded.id;
        const { fullName, username, bio, targetRole, experienceLevel, avatar } = req.body;

        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username && username !== existingUser.username) {
            const usernameTaken = await userModel.findOne({ username, _id: { $ne: userId } });
            if (usernameTaken) {
                return res.status(400).json({ message: "Username is already taken" });
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    ...(fullName !== undefined && { fullName }),
                    ...(username !== undefined && { username }),
                    ...(bio !== undefined && { bio }),
                    ...(targetRole !== undefined && { targetRole }),
                    ...(experienceLevel !== undefined && { experienceLevel }),
                    ...(avatar !== undefined && { avatar })
                }
            },
            { new: true }
        ).select("-password");

        const formattedUser = await formatUserResponse(updatedUser);
        return res.status(200).json({
            message: "Profile updated successfully",
            user: formattedUser
        });
    } catch (err) {
        console.error("updateProfile Error:", err.message);
        return res.status(500).json({
            message: "Failed to update profile"
        });
    }
};

/**
 * Upload profile avatar image to AWS S3 (or local storage)
 */
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please select an image file to upload." });
        }

        const avatarReference = await uploadAvatarImage(req.file, req.decoded.id);

        const updatedUser = await userModel.findByIdAndUpdate(
            req.decoded.id,
            { avatar: avatarReference },
            { new: true }
        ).select("-password");

        const formattedUser = await formatUserResponse(updatedUser);

        return res.status(200).json({
            message: "Avatar uploaded successfully",
            avatarUrl: formattedUser.avatar,
            user: formattedUser
        });
    } catch (err) {
        console.error("uploadAvatar Error:", err.message);
        return res.status(400).json({
            message: err.message || "Failed to upload profile picture"
        });
    }
};

/**
 * Google Auth
 */
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await userModel.findOne({ email });

        if (!user) {
            let username = name;
            let usernameExists = await userModel.findOne({ username });

            while (usernameExists) {
                username = `${name}_${Math.random().toString(36).slice(-4)}`;
                usernameExists = await userModel.findOne({ username });
            }

            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 13);
            user = await userModel.create({
                username,
                email,
                fullName: name || "",
                avatar: picture || "",
                password: hashedPassword,
                isVerified: true
            });
        }

        const jwtToken = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", jwtToken, cookieOptions);

        const formattedUser = await formatUserResponse(user);
        return res.status(200).json({
            message: "Google login successful",
            token: jwtToken,
            user: formattedUser
        });

    } catch (err) {
        console.error("Google Auth Error:", err.message);
        return res.status(500).json({
            message: "Google authentication failed"
        });
    }
};

/**
 * Send OTP to email (for registration or resend)
 */
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Find user by email (should exist from registration)
        const user = await userModel.findOne({ email: normalizedEmail });
        if (!user) {
            // For security, don't reveal whether email exists
            return res.status(200).json({
                message: "If the email exists in our system, you will receive an OTP shortly"
            });
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({
                message: "Email is already verified"
            });
        }

        // Check if we can resend (cooldown period of 60 seconds from last send)
        const COOLDOWN_SECONDS = 60;
        if (user.lastOtpSentAt) {
            const timeSinceLastSent = (Date.now() - new Date(user.lastOtpSentAt).getTime()) / 1000;
            if (timeSinceLastSent < COOLDOWN_SECONDS) {
                const secondsLeft = Math.ceil(COOLDOWN_SECONDS - timeSinceLastSent);
                return res.status(429).json({
                    message: `Please wait ${secondsLeft} seconds before requesting a new OTP`
                });
            }
        }

        // Generate and hash OTP
        const otp = generateOTP();
        const hashedOTP = await hashOTP(otp);

        // Store OTP hash and set expiration (5 minutes from now)
        const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || 5) * 60 * 1000);
        user.verificationToken = hashedOTP;
        user.verificationExpires = expiresAt;
        user.verificationAttempts = 0; // Reset attempts on new OTP
        user.lastOtpSentAt = new Date();
        await user.save();

        // Send OTP email
        const emailSent = await emailService.sendOTPEmail(normalizedEmail, otp, user.username || "");
        if (!emailSent) {
            return res.status(500).json({
                message: "Failed to send verification email"
            });
        }

        return res.status(200).json({
            message: "OTP sent successfully"
        });
    } catch (error) {
        console.error("Send OTP Error:", error.message);
        return res.status(500).json({
            message: "Error sending OTP"
        });
    }
};

/**
 * Verify OTP and complete registration
 */
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Find user by email
        const user = await userModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or OTP"
            });
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({
                message: "Email is already verified"
            });
        }

        // Check if OTP has expired
        if (!user.verificationExpires || new Date(user.verificationExpires) < new Date()) {
            return res.status(400).json({
                message: "OTP has expired. Please request a new one."
            });
        }

        // Check if attempts exceeded (max 5)
        if (user.verificationAttempts >= 5) {
            return res.status(400).json({
                message: "Maximum verification attempts exceeded. Please request a new OTP."
            });
        }

        // Verify OTP
        const isValid = await verifyOTPToken(otp, user.verificationToken);
        if (!isValid) {
            // Increment attempts
            user.verificationAttempts += 1;
            await user.save();

            const attemptsLeft = 5 - user.verificationAttempts;
            return res.status(400).json({
                message: attemptsLeft > 0 
                    ? `Invalid OTP. ${attemptsLeft} attempts remaining` 
                    : "Maximum verification attempts exceeded. Please request a new OTP."
            });
        }

        // OTP is valid - mark email as verified and invalidate OTP
        user.isVerified = true;
        user.verificationToken = "";
        user.verificationExpires = null;
        user.verificationAttempts = 0;
        await user.save();

        // Generate JWT token for newly verified user
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, cookieOptions);

        // Send welcome email (Failure to send email will not roll back account creation)
        try {
            await emailService.sendRegistrationSuccessEmail(user.email, user.username || "");
        } catch (emailErr) {
            console.error("Welcome email delivery failed (user remains verified):", emailErr.message);
        }

        const formattedUser = await formatUserResponse(user);
        return res.status(200).json({
            message: "Email verified successfully",
            token,
            user: formattedUser
        });

    } catch (error) {
        console.error("Verify OTP Error:", error.message);
        return res.status(500).json({
            message: "Error verifying OTP"
        });
    }
};

/**
 * Resend OTP (alias for send-otp with same logic)
 */
const resendOTP = sendOTP;

export default {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateProfile,
    uploadAvatar,
    googleAuth,
    sendOTP,
    verifyOTP,
    resendOTP
};