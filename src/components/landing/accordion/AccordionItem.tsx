import type {ReactNode} from "react"
import {IoIosAdd} from "react-icons/io"
import { FiMinus } from "react-icons/fi"

interface AccordionItemProps {
    title: string
    children: ReactNode
    isOpen: boolean
    onToggle: () => void
}

const AccordionItem = ({title, children, isOpen = false, onToggle}: AccordionItemProps) => {
    return (
        <div className='w-full rounded-xl p-4 bg-slate-50 border border-gray-200 '>
            <div className='w-full flex items-center justify-between'>
                <h1 className='font-semibold'>{title}</h1>
                <button onClick={onToggle} className="relative">
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                        {isOpen ? (
                            <FiMinus className='text-gray-600 text-lg' />
                        ) : (
                            <IoIosAdd className='text-gray-600 text-xl' />
                        )}
                    </div>
                </button>
            </div>
            <div className={`transition-all ease-linear duration-300 ${isOpen ? 'max-h-40' : 'max-h-0 overflow-hidden'}`}>
                <p className='text-sm text-gray-600'>{children}</p>
            </div>
        </div>
    )
}

export default AccordionItem