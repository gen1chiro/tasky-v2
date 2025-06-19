import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "../firebase/firebase"

interface AuthContextType {
    user: User | null
    loading: boolean
    isUserLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [isUserLoggedIn, setISUserLoggedIn] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    const initializeUser = async (user) => {
        if (user) {
            setUser(user)
            setISUserLoggedIn(true)
        } else {
            setUser(null)
            setISUserLoggedIn(false)
        }
        setLoading(false)
    }

    useEffect(() => {
        return onAuthStateChanged(auth, initializeUser)
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, isUserLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}