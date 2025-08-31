import type {ReactNode} from "react"
import {IoIosAdd} from "react-icons/io"
import { FiMinus } from "react-icons/fi"
import {motion} from "motion/react"

interface AccordionItemProps {
    title: string
    children: ReactNode
    isOpen: boolean
    onToggle: () => void
}

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
}

const AccordionItem = ({title, children, isOpen = false, onToggle}: AccordionItemProps) => {
    return (
        <motion.div
            variants={item}
            transition={{ duration: 0.5 }}
            className='w-full rounded-xl p-4 bg-slate-50 border border-gray-200 '>
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
        </motion.div>
    )
}

export default AccordionItem