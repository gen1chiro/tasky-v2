import React, { useState } from 'react'
import { useAuth } from "../../contexts/AuthContext.tsx"
import { handleSignIn, handleSignInWithGoogle } from "../../firebase/auth.ts"
import GoogleIcon from '../../assets/Google_Favicon.png'
import { Link, useNavigate, useLocation } from "react-router-dom"

const LogIn = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
    const [isLoggingInWithGoogle, setIsLoggingInWithGoogle] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { isUserLoggedIn } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/app'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoggingIn(true)
        try {
            await handleSignIn(email, password)
        } catch (err) {
            console.error(err)
            setIsLoggingIn(false)
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
        setError(null)
        setIsLoggingInWithGoogle(true)
        try {
            await handleSignInWithGoogle()
        } catch (err) {
            console.error(err)
            setIsLoggingInWithGoogle(false)
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
            {isUserLoggedIn && navigate(from, { replace: true })}
            <main className='w-full h-screen flex items-center justify-center bg-gray-100'>
                <div
                    className='w-11/12 max-w-sm bg-white flex flex-col items-center gap-6 py-4 px-7  rounded-2xl shadow-xl border border-gray-100'>
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
                        {error && <p className='w-full text-red-500 text-xs text-left'>{error}</p>}
                        <button
                            type='submit'
                            disabled={isLoggingIn}
                            className={`w-full bg-black text-white text-sm font-semibold py-2 mt-4 rounded-full hover:bg-zinc-800 ${isLoggingIn ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
                        >
                            {isLoggingIn ? 'Logging In...' : 'Log In'}
                        </button>
                        <div className='flex items-center w-full'>
                            <hr className='flex-1 h-[1px] border-gray-300'/>
                            <h1 className='px-2 text-sm text-gray-400'>OR</h1>
                            <hr className='flex-1 h-[1px] border-gray-300'/>
                        </div>
                        <button
                            type='button'
                            onClick={handleClickGoogle}
                            className={`w-full flex items-center justify-center gap-2 bg-gray-100 text-black text-sm font-semibold py-2 rounded-full hover:bg-gray-200 ${isLoggingInWithGoogle ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
                        >
                            <img
                                src={GoogleIcon}
                                alt='google logo'
                                className='aspect-square w-5'
                            />
                            {isLoggingInWithGoogle ? 'Logging In...' : 'Continue with Google'}
                        </button>
                    </form>
                    <p className='mt-8 text-xs text-gray-600'>Don't have an account?
                        <Link to="/sign-up" className='font-semibold text-black hover:underline'>
                            <span> Sign Up</span>
                        </Link>
                    </p>
                </div>
            </main>
        </>
    )
}

export default LogIn