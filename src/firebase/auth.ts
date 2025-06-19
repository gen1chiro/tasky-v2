import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth"
import { auth } from "./firebase"
import { GoogleAuthProvider } from "firebase/auth"

export const handleSignUp = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
}

export const handleSignIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    return await signInWithPopup(auth, provider)
}

export const handleSignOut = async () => {
    return auth.signOut()
}