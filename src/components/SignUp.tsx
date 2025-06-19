import React, { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.tsx"
import { handleSignUp } from "../firebase/auth.ts"

const SignUp = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [isSigningUp, setIsSigningUp] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { isUserLoggedIn } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setError(null)
        setIsSigningUp(true)

        try {
            await handleSignUp(email, password)
        } catch (err) {
            console.error(err)
            setIsSigningUp(false)
            //setEmail('')
            //setPassword('')
            //setConfirmPassword('')

            if (err.code === "auth/email-already-in-use") {
                setError("This email is already in use. Please try another.")
            } else if (err.code === "auth/invalid-email") {
                setError("Invalid email format. Please check your email.")
            } else if (err.code === "auth/weak-password") {
                setError("Password is too weak. Please choose a stronger password.")
            } else {
                setError("Failed to sign up. Please try again.")
            }
        }
    }

    return (
        <>
            {isUserLoggedIn && <Navigate to='/app' replace/>}
            <div
                className='max-w-sm mx-auto flex flex-col items-center gap-6 py-4 px-7  rounded-2xl shadow-xl border border-gray-100'>
                <div className='w-full flex flex-col items-center'>
                    <h1 className='text-2xl font-semibold tracking-wide'>Let's get started!</h1>
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
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full p-2 border-b focus:outline-0 focus:border-b-2 ${error ? 'border-red-500' : ''}`}
                        required
                    />
                    {error && <p className='text-red-500 text-sm'>{error}</p>}
                    <button
                        type='submit'
                        disabled={isSigningUp}
                        className={`w-full bg-black text-white text-sm font-semibold py-2 mt-4 rounded-full hover:bg-zinc-800 ${isSigningUp ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
                    >
                        {isSigningUp ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <p className='mt-8 text-xs text-gray-600'>Already have an account?
                    <Link to="/login" className='font-semibold text-black hover:underline'>
                        <span> Sign In</span>
                    </Link>
                </p>
            </div>
        </>
    )
}

export default SignUp