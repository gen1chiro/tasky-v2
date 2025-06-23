import { createBrowserRouter, createRoutesFromElements, Route, Outlet } from "react-router-dom"
import Landing from "../pages/Landing.tsx"
import LogIn from "../components/LogIn.tsx"
import ProtectedRoute from "../uitls/ProtectedRoute.tsx"
import Dashboard from "../pages/Dashboard.tsx"
import SignUp from "../components/SignUp.tsx"
import BoardPage from "../pages/BoardPage.tsx"
import { boardLoader } from "../firebase/firestore/boards.ts"

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route index element={<Landing />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/app" element={
                <ProtectedRoute>
                    <Outlet />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path=":boardId" element={<BoardPage />} loader={boardLoader} />
            </Route>
        </Route>
    )
)

export default router