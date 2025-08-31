import React, {useState} from 'react'
import PlanTile from './PlanTile.tsx'
import type {Plan} from '../../types/types.ts'
import {motion} from 'motion/react'

const plans: Plan[] = [
    {
        id: 0,
        name: "Hobby",
        price: "$0",
        desc: "For individuals who like to keep it simple and fun.",
        features: [
            "Unlimited boards & tasks",
            "Real-time collaboration",
            "Drag-and-drop interface",
            "Team sharing",
            "Cloud sync across devices",
            "Regular updates & improvements",
        ],
    },
    {
        id: 1,
        name: "Team",
        price: "$0",
        desc: "For early-stage startups and scaling companies.",
        features: [
            "Unlimited boards & tasks",
            "Real-time collaboration",
            "Drag-and-drop interface",
            "Team sharing",
            "Cloud sync across devices",
            "Regular updates & improvements",
        ],
    },
    {
        id: 2,
        name: "Enterprise",
        price: "$0",
        desc: "For organizations with custom needs and advanced security.",
        features: [
            "Unlimited boards & tasks",
            "Real-time collaboration",
            "Drag-and-drop interface",
            "Team sharing",
            "Cloud sync across devices",
            "Regular updates & improvements",
        ],
    },
]

interface PricingProps {
    ref: React.Ref<HTMLDivElement>
}

const Pricing = ({ref}: PricingProps) => {
    const [selectedPlanId, setSelectedPlanId] = useState(1)
    const planElements = plans.map(plan =>
        <PlanTile key={plan.id} plan={plan} selectedPlanId={selectedPlanId} setSelectedPlanId={setSelectedPlanId}/>
    )

    return (
        <motion.div
            initial={{opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{duration: 1}}
            viewport={{once: true, amount: 0.5}}
            ref={ref} className="w-11/12 max-w-7xl flex flex-col items-center pt-14 gap-8">
            <div className="w-5/6 md:w-1/2 flex flex-col items-center gap-3">
                <p className="w-fit mx-auto px-2 text-center bg-blue-500 text-white text-xs rounded-full">Pricing</p>
                <h1 className='w-full text-center text-xl md:text-3xl font-medium'>Simple pricing for everyone.</h1>
                <p className="w-full text-center text-xs md:text-sm text-gray-600">Tasky is completely free — no credit
                    card, no hidden fees. Enjoy unlimited boards, tasks, and collaboration without restrictions.</p>
            </div>
            <div className="w-full md:w-5/6 flex flex-wrap md:flex-nowrap items-start justify-between gap-2 bg-slate-50 border border-gray-200 shadow rounded-3xl p-1">
                {planElements}
            </div>
        </motion.div>
    )
}

export default Pricing