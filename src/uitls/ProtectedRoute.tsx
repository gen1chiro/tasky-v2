import { Navigate } from "react-router-dom";
import React from "react";

interface ProtectedRouteProps {
    isUserLoggedIn: boolean
    children: React.ReactNode;
}

const ProtectedRoute = ({ isUserLoggedIn, children }: ProtectedRouteProps) => {
    if (!isUserLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children
}

export default ProtectedRoute