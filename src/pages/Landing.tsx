import Navbar from "../components/landing/Navbar.tsx"
import Hero from "../components/landing/Hero.tsx"
import Features from "../components/landing/Features.tsx"

const Landing = () => {

    return (
        <div className="w-full min-h-screen flex flex-col items-center gap-4 pt-4 ">
            <Navbar/>
            <Hero/>
            <Features/>
            {/*<img src="../../public/test.png"/>*/}
        </div>
    )
}

export default Landing