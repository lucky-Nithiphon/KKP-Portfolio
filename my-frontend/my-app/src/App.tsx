import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

export default function App() {
  const { user, loading} = useAuth()

  if (loading) {
    return <div> กำลังโหลด...</div>
  }

  return (
    <Routes>
            {/* หน้าแรก — ต้อง login ก่อน */}
            <Route
                path="/"
                element={
                    user
                        ? <HomePage />           // login แล้ว → แสดง HomePage
                        : <Navigate to="/login" /> // ยังไม่ login → ไป login
                }
            />

            {/* หน้า Login — ถ้า login แล้วให้ไปหน้าแรกเลย */}
            <Route
                path="/login"
                element={
                    user
                        ? <Navigate to="/" />  // login แล้ว → ไปหน้าแรก
                        : <LoginPage />         // ยังไม่ login → แสดง LoginPage
                }
            />

            {/* หน้าสมัครสมาชิก */}
            <Route
                path="/register"
                element={
                    user
                        ? <Navigate to="/" />   // login แล้ว → ไปหน้าแรก
                        : <RegisterPage />       // ยังไม่ login → แสดง RegisterPage
                }
            />
        </Routes>
  )
}