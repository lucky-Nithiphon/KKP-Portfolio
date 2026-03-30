import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AddPortfolioPage from "./pages/AddPortfolioPage"

export default function App() {
  const { user, loading} = useAuth()

  if (loading) {
    return <div> กำลังโหลด...</div>
  }

  return (
    <Routes>
            {/* หน้าแรก — แสดงให้ทุกคนเห็น แต่ปุ่มดูข้างในจะเช็ค login อีกที */}
            <Route path="/" element={<HomePage />} />

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

            {/* หน้าเพิ่ม Portfolio — ให้ทุกคนเข้าได้ตามที่คุณต้องการ */}
            <Route path="/add-portfolio" element={<AddPortfolioPage />} />
        </Routes>
  )
}