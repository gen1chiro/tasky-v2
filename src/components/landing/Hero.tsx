import {Link} from "react-router-dom"
import heroImage from "../../assets/hero.png"
import heroImageMobile from "../../assets/hero2.png"
import {HiLightningBolt} from "react-icons/hi"
import React from "react"
import {motion} from "motion/react"

interface HeroProps {
    ref: React.Ref<HTMLDivElement>
}

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
}

const Hero = ({ref}: HeroProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{duration: 2}}
            ref={ref}
            className="flex flex-col items-center justify-between h-auto w-11/12 max-w-7xl rounded-3xl bg-white [background:radial-gradient(100%_175%_at_50%_40%,#fff_40%,#60a5fa_100%)]">
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="flex flex-grow flex-col items-center justify-center text-center gap-6 pt-18 pb-10 lg:pb-14">
                <motion.p
                    variants={item}
                    transition={{ duration: 0.5 }}
                    className="w-fit px-2 py-[1px] text-center bg-blue-500 text-white text-xs rounded-full flex items-center gap-1">
                    <HiLightningBolt/>
                    Product
                </motion.p>
                <motion.h1
                    variants={item}
                    transition={{ duration: 0.5 }}
                    className="w-5/6 md:w-1/2 text-3xl lg:text-5xl font-semibold text-zinc-800 tracking-tight">The
                    smarter way to plan, track, and complete your work</motion.h1>
                <motion.p
                    variants={item}
                    transition={{ duration: 0.5 }}
                    className="w-5/6 md:w-1/2 text-xs md:text-sm text-gray-600">From personal to-dos to complex team
                    projects, Tasky keeps everyone aligned, making collaboration <b>smooth and effortless</b>.</motion.p>
                <motion.div
                    variants={item}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4">
                    <Link to="/sign-up"
                          className='bg-white hover:bg-gray-100 rounded border border-gray-200 text-sm px-4 py-1 transition-colors duration-300'>Learn
                        more</Link>
                    <Link to="/sign-up"
                          className='bg-blue-600 hover:bg-blue-500 rounded text-white text-sm px-4 py-1 transition-colors duration-300'>Get
                        started</Link>
                </motion.div>
            </motion.div>
            <img src={heroImage as string} alt="app"
                 className="hidden lg:block rounded-t-3xl border-[20px] border-b-0 border-gray-200/20 w-11/12 shadow-lg"/>
            <img src={heroImageMobile as string} alt="app"
                 className="lg:hidden rounded-t-3xl border-[10px] md:border-[20px] border-b-0 md:border-b-0 border-gray-200/20 w-11/12 shadow-lg"/>
        </motion.div>
    )
}

export default Hero