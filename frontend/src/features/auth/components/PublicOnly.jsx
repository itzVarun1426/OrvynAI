import { useAuth } from "../hooks/useAuth.js";
import { Navigate } from "react-router";

const PublicOnly = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return null;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicOnly;
