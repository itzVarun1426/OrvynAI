import userModel from "../models/user.model.js";
import blacklistedTokenModel from "../models/blacklist.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { uploadAvatarImage, getPresignedAvatarUrl } from "../services/s3.service.js";

const client = new OAuth2Client();

const cookieOptions = {
    httpOnly: true,
    secure: false,       // only while in development
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
 * Register a new user
 */
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const userExists = await userModel.findOne({
            $or: [{ username }, { email }]
        });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 13);
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        });
        const token = jwt.sign(
            {
                id: newUser._id,
                username: newUser.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("token", token, cookieOptions);

        const formattedUser = await formatUserResponse(newUser);
        return res.status(201).json({
            message: "User created successfully",
            user: formattedUser
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
        const user = await userModel.findOne({ email });
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
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        res.clearCookie("token", cookieOptions);
        await blacklistedTokenModel.create({ token });

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
                password: hashedPassword
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
            user: formattedUser
        });

    } catch (err) {
        console.error("Google Auth Error:", err.message);
        return res.status(500).json({
            message: "Google authentication failed"
        });
    }
};

export default {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateProfile,
    uploadAvatar,
    googleAuth
};