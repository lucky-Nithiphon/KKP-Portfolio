import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import App from "./App"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {/* BrowserRouter ทำให้ใช้ระบบ route ได้ */}
        <BrowserRouter>
            {/* AuthProvider ทำให้ทุกหน้าเข้าถึง user ได้ */}
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
)