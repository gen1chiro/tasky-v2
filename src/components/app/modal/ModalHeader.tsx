import React from "react"

interface ModalHeaderProps {
    children: React.ReactNode
}

const ModalHeader = ({children}: ModalHeaderProps) => {
    return (
        <h1 className="text-left w-full font-semibold text-md">
            {children}
        </h1>
    )
}

export default ModalHeader