import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import Landing from "../pages/Landing.tsx"
import LogIn from "../components/LogIn.tsx"
import ProtectedRoute from "../uitls/ProtectedRoute.tsx"
import MainApplication from "../pages/MainApplication.tsx"
import SignUp from "../components/SignUp.tsx"


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route index element={<Landing />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/app" element={
                <ProtectedRoute>
                    <MainApplication />
                </ProtectedRoute>
            }
            />
        </Route>
    )
)

export default router