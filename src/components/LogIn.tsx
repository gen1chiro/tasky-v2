import React, { useState } from 'react'
import { useAuth } from "../contexts/AuthContext.tsx"
import { handleSignIn, handleSignInWithGoogle } from "../firebase/auth.ts"
import GoogleIcon from '../assets/Google_Favicon.png'
import { Navigate } from "react-router-dom"

const LogIn = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const {isUserLoggedIn} = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        try {
            await handleSignIn(email, password)
        } catch (err) {
            console.error(err)
            clearInputFields()
            if (err.code === "auth/wrong-password") {
                setError("Incorrect password. Please try again.")
            } else if (err.code === "auth/user-not-found") {
                setError("No account found with this email.")
            } else if (err.code === "auth/invalid-credential") {
                setError("Invalid credentials. Please check your email and password.")
            } else {
                setError("Failed to log in. Please try again.")
            }
        }
    }

    const handleClickGoogle = async () => {
        try {
            await handleSignInWithGoogle()
        } catch (err) {
            console.error(err);
            clearInputFields()
            if (err.code === "auth/popup-closed-by-user") {
                setError("Google login popup was closed. Please try again.")
            } else {
                setError("Failed to log in with Google. Please try again.")
            }
        }
    }

    const clearInputFields = () => {
        setEmail('')
        setPassword('')
    }

    return (
        <>
            {isUserLoggedIn && <Navigate to='/app' replace/>}
            <div
                className='max-w-sm mx-auto flex flex-col items-center gap-6 py-4 px-7  rounded-2xl shadow-xl border border-gray-100'>
                <div className='w-full flex flex-col items-center'>
                    <h1 className='text-2xl font-semibold tracking-wide'>Welcome back!</h1>
                    <p className='text-sm text-gray-600'>Please enter your details</p>
                </div>
                <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-4'>
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full p-2 border-b focus:outline-0 focus:border-b-2 ${error ? 'border-red-500' : ''}`}
                        required
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full p-2 border-b focus:outline-0 focus:border-b-2 ${error ? 'border-red-500' : ''}`}
                        required
                    />
                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                    <button
                        type='submit'
                        className='w-full bg-black text-white font-semibold py-3 mt-4 rounded-full hover:bg-zinc-800'
                    >
                        Log In
                    </button>
                    <button
                        type='button'
                        onClick={handleClickGoogle}
                        className='w-full flex items-center justify-center gap-2 bg-gray-100 text-black font-semibold py-3 rounded-full hover:bg-gray-200'
                    >
                        <img
                            src={GoogleIcon}
                            alt='google logo'
                            className='aspect-square w-5'
                        />
                        Log in with Google
                    </button>
                </form>
                <p className='mt-8 text-xs text-gray-600'>Don't have an account?<span
                    className='font-semibold text-black'> Sign Up</span></p>
            </div>
        </>
)
}

export default LogIn