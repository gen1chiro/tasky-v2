import {useState, Children, cloneElement, type ReactElement} from "react"

interface AccordionProps {
    children: ReactElement<AccordionItemProps> | ReactElement<AccordionItemProps>[]
}

interface AccordionItemProps {
    isOpen: boolean
    onToggle: () => void
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
        <div className='w-full flex flex-col items-center justify-start gap-2'>
            {childElements}
        </div>
    )
}

export default Accordion