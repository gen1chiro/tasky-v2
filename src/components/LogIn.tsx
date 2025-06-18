import React, { useState } from 'react'
import GoogleIcon from '../assets/Google_Favicon.png'

const LogIn = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        //Log in to firebase
    }

    return (
        <div className='max-w-sm mx-auto flex flex-col items-center gap-6 py-4 px-7  rounded-2xl shadow-xl border border-gray-100'>
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
                    className='w-full p-2 border-b focus:outline-0 focus:border-b-2'
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full p-2 border-b focus:outline-0 focus:border-b-2'
                    required
                />
                <button
                    type='submit'
                    className='w-full bg-black text-white font-semibold py-3 mt-4 rounded-full hover:bg-zinc-800'
                >
                    Log In
                </button>
                <button
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
            <p className='mt-8 text-xs text-gray-600'>Don't have an account?<span className='font-semibold text-black'> Sign Up</span></p>
        </div>
    )
}

export default LogIn