import React from 'react'

interface FeatureTileProps {
    children: React.ReactNode
    aspect: string
}

const FeatureTile = ({children, aspect}: FeatureTileProps) => {
    return (
        <div className={`h-full flex flex-col justify-end bg-slate-50 p-4 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow duration-200 ${aspect}`}>
            {children}
        </div>
    )
}

export default FeatureTile