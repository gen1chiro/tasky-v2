import React from "react"

interface ModalProps {
    children:  React.ReactNode
}

const ModalMessage = ({children}: ModalProps) => {
    return (
        <p className='w-full text-left text-sm text-gray-600'>{children}</p>
    )
}

export default ModalMessage