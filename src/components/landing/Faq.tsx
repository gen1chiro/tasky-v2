import type {Faq} from '../../types/types.tsx'
import Accordion from "./accordion/Accordion.tsx"
import AccordionItem from "./accordion/AccordionItem.tsx"
import React from "react"
import {motion} from "motion/react"

const faqs: Faq[] = [
    {
        question: "Is Tasky really free?",
        answer: "Yes! Tasky is completely free. You can create unlimited boards, tasks, and collaborate with your team without any hidden costs."
    },
    {
        question: "Do I need an account to start?",
        answer: "You’ll need a free account to save your boards, sync across devices, and collaborate in real time with your team."
    },
    {
        question: "Can I use Tasky with my team?",
        answer: "Absolutely! You can share boards, assign tasks, and work together with teammates seamlessly."
    },
    {
        question: "Does Tasky sync across devices?",
        answer: "Yes. Your tasks, boards, and updates are synced instantly across all devices connected to your account."
    },
    {
        question: "Will Tasky stay free forever?",
        answer: "Yes. The free plan will always be available. In the future, we may add premium features for advanced workflows, but core collaboration will remain free."
    },
    {
        question: "Is this an actual product?",
        answer: "Not quite! Tasky is a demo project created to showcase my skills in React, TypeScript, and Firebase. It’s not a real product yet, but I’m open to feedback and ideas!"
    }
]

interface FaqSectionProps {
    ref: React.Ref<HTMLDivElement>
}

const FaqSection = ({ref}: FaqSectionProps) => {
    return (
        <motion.div
            initial={{opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{duration: 1}}
            viewport={{once: true, amount: 0.5}}
            ref={ref} className='w-11/12 max-w-7xl flex justify-center pt-16'>
            <div className="w-full md:w-5/6 flex flex-col lg:flex-row gap-x-4 gap-y-8">
                <div className='w-full flex flex-col items-start gap-2'>
                    <p className="w-fit px-2 text-center bg-blue-500 mx-auto lg:mx-0 text-white text-xs rounded-full">FAQ</p>
                    <h1 className='w-full text-xl md:text-2xl text-center lg:text-left font-medium'>You've got questions, we've got
                        answers.</h1>
                    <p className='text-sm text-gray-600 text-center lg:text-left'>Got questions? We’ve got answers. Explore our frequently asked questions to quickly find information about Tasky’s features and setup — so you can focus on getting things done."</p>
                </div>
                <div className='w-full'>
                    <Accordion>
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} title={faq.question} isOpen={false} onToggle={() => {
                            }}>
                                {faq.answer}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </motion.div>
    )
}

export default FaqSection
