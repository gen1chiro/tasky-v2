import {useState, Children, cloneElement, type ReactElement} from "react"
import {motion} from "motion/react"

interface AccordionProps {
    children: ReactElement<AccordionItemProps> | ReactElement<AccordionItemProps>[]
}

interface AccordionItemProps {
    isOpen: boolean
    onToggle: () => void
}

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}

const Accordion = ({children}: AccordionProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const toggleActive = (index: number): void => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    const childElements = Children.map(children, (child: ReactElement<AccordionItemProps>, index) =>
        cloneElement(child, {
            isOpen: activeIndex === index,
            onToggle: () => toggleActive(index),
        })
    )

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, amount: 0.5}}
            className='w-full flex flex-col items-center justify-start gap-2'>
            {childElements}
        </motion.div>
    )
}

export default Accordion