
const Modal = ({children, ref, onClose}) => {
    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose()
        }
    }

    // internal div is to avoid clicks on the dialog itself from closing it
    return (
        <dialog
            ref={ref}
            onClick={handleBackdropClick}
            className="bg-white rounded-md shadow-lg w-96 backdrop-blur-sm fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
            <div className='w-full h-full p-4'>
                {children}
            </div>
        </dialog>
    )
}

export default Modal