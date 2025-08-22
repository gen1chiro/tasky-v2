import {useRef} from "react"
import Navbar from "../components/landing/Navbar.tsx"
import Hero from "../components/landing/Hero.tsx"
import Features from "../components/landing/Features.tsx"
import Pricing from "../components/landing/Pricing.tsx"
import FaqSection from "../components/landing/Faq.tsx"
import CtaBanner from "../components/landing/CtaBanner.tsx"
import Footer from "../components/landing/Footer.tsx"

const Landing = () => {
    const heroRef = useRef<HTMLDivElement>(null)
    const featuresRef = useRef<HTMLDivElement>(null)
    const pricingRef = useRef<HTMLDivElement>(null)
    const faqRef = useRef<HTMLDivElement>(null)
    const refs = {
        hero: heroRef,
        features: featuresRef,
        pricing: pricingRef,
        faq: faqRef,
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center gap-4 pt-4 ">
            <Navbar refs={refs}/>
            <Hero ref={heroRef}/>
            <Features ref={featuresRef}/>
            <Pricing ref={pricingRef}/>
            <FaqSection ref={faqRef}/>
            <CtaBanner/>
            <Footer refs={refs}/>
        </div>
    )
}

export default Landing