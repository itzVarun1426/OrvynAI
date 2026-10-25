import { useAuth } from "../hooks/useAuth.js";
import { Navigate } from "react-router";

const PublicOnly = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-4 transition-colors">
                <div className="relative flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
                </div>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicOnly;
