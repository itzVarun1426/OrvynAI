import axios from "axios";

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

const generateInterviewReport = async ({ selfDescription, jobDescription, resume }) => {
    try {
        const formData = new FormData();
        formData.append("selfDescription", selfDescription || "");
        formData.append("jobDescription", jobDescription || "");

        if (resume && resume instanceof File) {
            formData.append("resume", resume);
        }

        const response = await api.post("/api/interview", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response.data;
    } catch (err) {
        console.error("error in interview.api.js while generating interview report", err);
        throw err;
    }
};

const getInterviewReportById = async (interviewId) => {
    try {
        if (!interviewId) return null;
        const response = await api.get(`/api/interview/report/${interviewId}`);
        return response.data;
    } catch (err) {
        console.error("error fetching interview by id", err);
        return null;
    }
};

const getAllInterviewReportByUserId = async () => {
    try {
        const response = await api.get("/api/interview");
        if (!response.data || !response.data.reports) {
            return [];
        }
        return response.data.reports;
    } catch (err) {
        console.error("error in interview.api.js while getting all interview reports", err);
        return [];
    }
};

const deleteInterviewReport = async (interviewId) => {
    try {
        const response = await api.delete(`/api/interview/${interviewId}`);
        return response.data;
    } catch (err) {
        console.error("error in interview.api.js while deleting interview report", err);
        throw err;
    }
};

const submitAnswer = async (interviewId, { questionType, questionIndex, userAnswer, audioBlob }) => {
    try {
        const formData = new FormData();
        formData.append("questionType", questionType || "adaptive");
        formData.append("questionIndex", questionIndex);
        formData.append("userAnswer", userAnswer || "");
        
        if (audioBlob) {
            formData.append("audio", audioBlob, "answer.webm");
        }

        const response = await api.post(`/api/interview/${interviewId}/answer`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (err) {
        console.error("error in interview.api.js while submitting answer", err);
        throw err;
    }
};

const getNextAdaptiveQuestion = async (interviewId) => {
    try {
        const response = await api.post(`/api/interview/${interviewId}/next-question`);
        return response.data;
    } catch (err) {
        console.error("error getting next adaptive question", err);
        throw err;
    }
};

const completeInterview = async (interviewId) => {
    try {
        const response = await api.post(`/api/interview/${interviewId}/complete`);
        return response.data;
    } catch (err) {
        console.error("error in interview.api.js while completing interview", err);
        throw err;
    }
};

const retryWeakAreas = async (interviewId) => {
    try {
        const response = await api.post(`/api/interview/${interviewId}/retry-weak`);
        return response.data;
    } catch (err) {
        console.error("error creating weak area practice session", err);
        throw err;
    }
};

export {
    generateInterviewReport,
    getInterviewReportById,
    getAllInterviewReportByUserId,
    deleteInterviewReport,
    submitAnswer,
    getNextAdaptiveQuestion,
    completeInterview,
    retryWeakAreas
};
