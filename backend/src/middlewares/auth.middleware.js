import jwt from 'jsonwebtoken';
import blacklistedTokenModel from '../models/blacklist.model.js';
import userModel from '../models/user.model.js';

async function authUser(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({
            message: "token not provided"
        });
    }

    const isTokenBlacklisted = await blacklistedTokenModel.findOne({ token });
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "unauthorized blacklisted token"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Security check: Verify that the user exists and their email is confirmed
        const user = await userModel.findById(decoded.id).select("isVerified");
        if (!user) {
            return res.status(401).json({
                message: "User account not found"
            });
        }

        if (user.isVerified === false) {
            return res.status(403).json({
                message: "Email address not verified",
                isVerified: false
            });
        }

        req.decoded = decoded;
        next();
    }
    catch (err) {
        console.log("Auth Middleware Error:", err.message);
        return res.status(401).json({
            message: "unauthorized"
        });
    }
}

export default { authUser };
