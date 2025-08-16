import React from 'react'

const FeatureTile = ({children, aspect}) => {
    return (
        <div className={`flex flex-col justify-end bg-slate-50 p-4 border border-gray-200 rounded-lg shadow ${aspect}`}>
            {children}
        </div>
    )
}

export default FeatureTile