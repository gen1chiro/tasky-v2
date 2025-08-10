import {createBrowserRouter, createRoutesFromElements, Route, Outlet} from "react-router-dom"
import Landing from "../pages/Landing.tsx"
import LogIn from "../components/auth/LogIn.tsx"
import ProtectedRoute from "../components/utils/ProtectedRoute.tsx"
import Dashboard from "../pages/Dashboard.tsx"
import SignUp from "../components/auth/SignUp.tsx"
import BoardPage from "../pages/BoardPage.tsx"
import {boardLoader} from "../firebase/firestore/boards.ts"
import {ErrorBoundary} from "../components/utils/ErrorBoundary.tsx"
import type {ReactNode} from "react"
import SharePage from "../pages/SharePage.tsx"

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route index element={<Landing/>}/>
            <Route path="/login" element={<LogIn/>}/>
            <Route path="/sign-up" element={<SignUp/>}/>
            <Route path="/app"
                   element={
                       <ProtectedRoute>
                           <Outlet/>
                       </ProtectedRoute>
                   }
                   errorElement={
                       <ProtectedRoute>
                           <ErrorBoundary/>
                       </ProtectedRoute>
                   }
            >
                <Route index element={<Dashboard/>}/>
                <Route path="share" element={<SharePage/>}/>
                <Route path=":boardId" element={<BoardPage/>} loader={boardLoader}/>
            </Route>
        </Route> as ReactNode
    )
)

export default router