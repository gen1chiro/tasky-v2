import {Link} from "react-router-dom";
import React from "react";

const Hero = () => {
    return (
        <div
            className="flex flex-col items-center justify-between h-auto w-11/12 max-w-7xl rounded-3xl bg-white [background:radial-gradient(100%_175%_at_50%_40%,#fff_40%,#60a5fa_100%)]">
            <div className="flex flex-grow flex-col items-center justify-center text-center gap-6 pt-18 pb-10 lg:pb-14">
                <h1 className="w-5/6 md:w-1/2 text-3xl lg:text-5xl font-semibold text-zinc-800 tracking-tight">The
                    smarter way to plan, track, and complete your work</h1>
                <p className="w-5/6 md:w-1/2 text-xs md:text-sm text-gray-600">From personal to-dos to complex team
                    projects, Tasky keeps everyone aligned, making collaboration <b>smooth and effortless</b>.</p>
                <div className="flex items-center gap-4">
                    <Link to="/sign-up"
                          className='bg-white hover:bg-gray-100 rounded border border-gray-200 text-sm px-4 py-1 transition-colors duration-300'>Learn
                        more</Link>
                    <Link to="/sign-up"
                          className='bg-blue-600 hover:bg-blue-500 rounded text-white text-sm px-4 py-1 transition-colors duration-300'>Get
                        started</Link>
                </div>
            </div>
            <img src="../../../public/hero.png" alt="app"
                 className="hidden lg:block rounded-t-3xl border border-gray-200 w-11/12 shadow-lg"/>
            <img src="../../../public/hero2.png" alt="app"
                 className="lg:hidden rounded-t-3xl border border-gray-200 w-11/12 shadow-lg"/>
        </div>
    )
}

export default Hero