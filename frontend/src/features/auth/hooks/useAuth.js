import { useContext, useState } from "react";
import { authContext } from "../Auth.context.jsx";
import { login, register, logout, googleLogin, updateProfileApi, uploadAvatarApi, sendOTP, verifyOTP, resendOTP } from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    const { user, setUser, loading, setLoading, authError, setAuthError } = context;

    const handleLogin = async ({ email, password }) => {
        setAuthError(null);
        try {
            setLoading(true);
            const data = await login({ email, password });
            setUser(data.user);
            return true;
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Invalid email or password";
            setAuthError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setAuthError(null);
        try {
            setLoading(true);
            const data = await register({ username, email, password });
            // Do NOT log the user in immediately; account is unverified until OTP is confirmed
            return true;
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Registration failed";
            setAuthError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setAuthError(null);
        try {
            setLoading(true);
            await logout();
            setUser(null);
            return true;
        } catch (err) {
            setAuthError("Logout failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (token) => {
        setAuthError(null);
        try {
            setLoading(true);
            const data = await googleLogin(token);
            setUser(data.user);
            return true;
        } catch (err) {
            setAuthError(err.message || "Google Login failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (profileData) => {
        setAuthError(null);
        try {
            const data = await updateProfileApi(profileData);
            if (data?.user) {
                setUser(data.user);
            }
            return data;
        } catch (err) {
            setAuthError(err.message || "Failed to update profile");
            throw err;
        }
    };

    const handleUploadAvatar = async (file) => {
        setAuthError(null);
        try {
            const data = await uploadAvatarApi(file);
            if (data?.user) {
                setUser(data.user);
            }
            return data;
        } catch (err) {
            setAuthError(err.message || "Failed to upload avatar");
            throw err;
        }
    };

    const handleSendOTP = async ({ email }) => {
        setAuthError(null);
        try {
            setLoading(true);
            const data = await sendOTP({ email });
            return true;
        } catch (err) {
            setAuthError(err.message || "Failed to send OTP");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async ({ email, otp }) => {
        setAuthError(null);
        try {
            setLoading(true);
            const data = await verifyOTP({ email, otp });
            setUser(data.user);
            return true;
        } catch (err) {
            setAuthError(err.message || "Invalid OTP");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async ({ email }) => {
        setAuthError(null);
        try {
            setLoading(true);
            const data = await resendOTP({ email });
            return data;
        } catch (err) {
            setAuthError(err.message || "Failed to resend OTP");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        authError,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGoogleLogin,
        handleUpdateProfile,
        handleUploadAvatar,
        handleSendOTP,
        handleVerifyOTP,
        handleResendOTP
    };
};