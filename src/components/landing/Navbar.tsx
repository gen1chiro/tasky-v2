import React from 'react'
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <header className="fixed w-full flex items-center justify-center pt-3">
            <nav
                className="w-11/12 max-w-7xl flex justify-between items-center px-4 py-2 border border-gray-300 rounded-lg backdrop-blur-xs bg-gray-200/50 shadow-md">
                <Link to="/" className="flex items-center w-8 p-1 rounded bg-blue-500">
                    <img src='../../../public/tasky.png' alt="tasky"/>
                </Link>
                <ul className='flex items-center gap-4 text-sm cursor-pointer'>
                    <li className='hover:font-medium'>Product</li>
                    <li className='hover:font-medium'>Features</li>
                    <li className='hover:font-medium'>Customers</li>
                    <li className='hover:font-medium'>Pricing</li>
                </ul>
                <div className='flex items-center gap-2'>
                    <Link to="/sign-up"
                          className='bg-blue-500 hover:bg-blue-400 rounded-lg text-white text-sm px-5 py-1 transition-colors duration-300'>Sign
                        Up</Link>
                    <Link to="/login" className='bg-black hover:bg-zinc-700 rounded-lg text-white text-sm px-5 py-1 transition-colors duration-300'>Log
                        In</Link>
                </div>
            </nav>
        </header>
    )
}

export default Navbar