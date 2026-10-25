import axios from "axios";

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// Attach Authorization header from localStorage if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        });
        return response.data;
    } catch (err) {
        console.error("Registration error:", err.response?.data || err.message);
        const errorMsg = err.response?.data?.message || err.message || "Registration failed";
        const customErr = new Error(errorMsg);
        customErr.response = err.response;
        throw customErr;
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        });
        if (response.data?.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (err) {
        console.error("Login error:", err.response?.data || err.message);
        const errorMsg = err.response?.data?.message || err.message || "Login failed";
        const customErr = new Error(errorMsg);
        customErr.response = err.response;
        customErr.isVerified = err.response?.data?.isVerified;
        throw customErr;
    }
}

export async function googleLogin(token) {
    try {
        const response = await api.post("/api/auth/google", {
            token
        });
        if (response.data?.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (err) {
        console.error("Google Login error:", err.response?.data || err.message);
        throw err.response?.data || new Error("Google Login failed");
    }
}

export async function sendOTP({ email }) {
    try {
        const response = await api.post('/api/auth/send-otp', {
            email
        });
        return response.data;
    } catch (err) {
        console.error("Send OTP error:", err.response?.data || err.message);
        throw err.response?.data || new Error("Failed to send OTP");
    }
}

export async function verifyOTP({ email, otp }) {
    try {
        const response = await api.post('/api/auth/verify-otp', {
            email, otp
        });
        if (response.data?.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (err) {
        console.error("Verify OTP error:", err.response?.data || err.message);
        throw err.response?.data || new Error("Failed to verify OTP");
    }
}

export async function resendOTP({ email }) {
    try {
        const response = await api.post('/api/auth/resend-otp', {
            email
        });
        return response.data;
    } catch (err) {
        console.error("Resend OTP error:", err.response?.data || err.message);
        throw err.response?.data || new Error("Failed to resend OTP");
    }
}

export async function logout() {
    try {
        const response = await api.post("/api/auth/logout");
        localStorage.removeItem("token");
        return response.data;
    } catch (err) {
        console.error("Logout error:", err.message);
        localStorage.removeItem("token");
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me");
        return response.data;
    } catch (err) {
        // Return null silently for unauthenticated / 401 initial session check
        return null;
    }
}

export async function updateProfileApi(profileData) {
    try {
        const response = await api.put("/api/auth/profile", profileData);
        return response.data;
    } catch (err) {
        console.error("Update profile error:", err.response?.data || err.message);
        throw err.response?.data || new Error("Failed to update profile");
    }
}

export async function uploadAvatarApi(file) {
    try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await api.post("/api/auth/upload-avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (err) {
        console.error("Upload avatar error:", err.response?.data || err.message);
        throw err.response?.data || new Error("Failed to upload avatar");
    }
}

export default api;
