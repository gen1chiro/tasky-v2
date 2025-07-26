
const Modal = ({children, ref}) => {
    return (
        <dialog ref={ref} className="bg-white rounded-md shadow-lg p-4 w-96 backdrop-blur-sm fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {children}
        </dialog>
    )
}

export default Modal