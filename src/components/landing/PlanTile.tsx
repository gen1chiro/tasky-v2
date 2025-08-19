import React from 'react'
import {Link} from 'react-router-dom'
import { FaRegCircleCheck } from "react-icons/fa6"

const PlanTile = ({plan, selectedPlanId, setSelectedPlanId}) => {
    const isSelected = plan.id === selectedPlanId
    const features = plan.features.map((feature, i) =>
        <li key={i} className="flex items-center gap-1 mt-4">
            <FaRegCircleCheck className={`${isSelected ? 'text-blue-500' : 'text-gray-600'} text-xs`}/>
            <span className='ml-2 text-sm text-gray-600'>{feature}</span>
        </li>
    )

    const handleTileClick = () => {
        setSelectedPlanId(plan.id)
    }

    return (
        <div className={`w-full flex flex-col gap-4 p-4 ${isSelected ? 'bg-white' : ''} hover:bg-white rounded-3xl border hover:border-gray-200 ${isSelected ? 'border-gray-200' : 'border-slate-50'} transition-colors duration-200 cursor-pointer`}
            onClick={handleTileClick}
        >
            <div>
                <h2 className='text-md font-medium'>{plan.name}</h2>
                <h1 className='text-xl font-semibold flex items-center gap-1'>{plan.price}<span
                    className='text-sm text-gray-600 font-light'> /month</span></h1>
            </div>
            <p className='text-sm text-gray-600 font-light'>{plan.desc}</p>
            <Link to='/sign-up'
                  className='bg-white hover:bg-gray-100 text-sm font-medium text-center border border-gray-300 rounded-md py-1 transition-colors duration-200'>Try for
                free
            </Link>
            <hr className='border-gray-200'/>
            <ul>
                {features}
            </ul>
        </div>
    )
}

export default PlanTile;