import { useRouteError, isRouteErrorResponse } from "react-router-dom"
import ErrorElement from "./ErrorElement.tsx"

export const ErrorBoundary = () => {
    const error = useRouteError()

    if ( isRouteErrorResponse(error)) {
        switch (error.status) {
            case 403:
                return <ErrorElement title="Access Denied" message="You do not have permission to view this content." />
            case 404:
                return <ErrorElement title="Content Not Found" message="The content you are looking for does not exist." />
            default:
                return <ErrorElement title="Unexpected Error" message="An unexpected error occurred. Please try again later." />
        }
    }

    return <ErrorElement title="An Error Occurred" message="Something went wrong. Please try again later." />
}

export default ErrorBoundary