import Navbar from "../components/landing/Navbar.tsx"
import Hero from "../components/landing/Hero.tsx"
import Features from "../components/landing/Features.tsx"
import Pricing from "../components/landing/Pricing.tsx"
import FaqSection from "../components/landing/Faq.tsx"
import CtaBanner from "../components/landing/CtaBanner.tsx"

const Landing = () => {

    return (
        <div className="w-full min-h-screen flex flex-col items-center gap-4 pt-4 ">
            <Navbar/>
            <Hero/>
            <Features/>
            <Pricing/>
            <FaqSection/>
            <CtaBanner/>
            {/*<img src="../../public/test.png"/>*/}
        </div>
    )
}

export default Landing