import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing.tsx"
import LogIn from "./components/LogIn.tsx"
import MainApplication from "./pages/MainApplication.tsx"
import ProtectedRoute from "./uitls/ProtectedRoute.tsx"
import { useAuth } from "./contexts/AuthContext.tsx"

function App() {
    const { isUserLoggedIn } = useAuth()

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/app" element={
                    <ProtectedRoute isUserLoggedIn={isUserLoggedIn}>
                         <MainApplication />
                    < /ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App
