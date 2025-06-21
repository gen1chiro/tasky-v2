import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth"
import { auth } from "./firebase"
import { GoogleAuthProvider } from "firebase/auth"
import { saveUserToDatabase } from "./data.ts"

export const handleSignUp = async (email: string, password: string) => {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredentials.user

    await saveUserToDatabase(user.uid, user.email)

    return userCredentials
}

export const handleSignIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const userCredentials =  await signInWithPopup(auth, provider)
    const user = userCredentials.user

    await saveUserToDatabase(user.uid, user.email)

    return userCredentials
}

export const handleSignOut = async () => {
    return auth.signOut()
}