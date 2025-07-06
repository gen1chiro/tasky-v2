
type ErrorElementProps = {
    title: string
    message: string
}

const ErrorElement = ({title, message}: ErrorElementProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-black">{title}</h1>
            <p className="mt-4 text-gray-700">{message}</p>
        </div>
    )
}

export default ErrorElement