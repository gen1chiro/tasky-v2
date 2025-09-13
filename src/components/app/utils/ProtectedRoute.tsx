import {Navigate, useLocation} from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext.tsx"
import React from "react"

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isUserLoggedIn, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!isUserLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children
}

export default ProtectedRoute