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
        return <div>Loading...</div>
    }

    if (!isUserLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children
}

export default ProtectedRoute