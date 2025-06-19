import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"
import React from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isUserLoggedIn } = useAuth()

    if (!isUserLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children
}

export default ProtectedRoute