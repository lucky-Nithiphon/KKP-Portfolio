import React, { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, Link } from "react-router-dom"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            
            // Update profile กับ displayName
            await updateProfile(userCredential.user, {
                displayName: displayName
            })
            
            navigate("/")
        } catch (err: any) {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-container">
            <h2>สมัครสมาชิก</h2>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>ชื่อที่แสดง</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="กรอกชื่อที่แสดง"
                        required
                    />
                </div>

                <div>
                    <label>อีเมล</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="กรอกอีเมล"
                        required
                    />
                </div>

                <div>
                    <label>รหัสผ่าน</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="กรอกรหัสผ่าน"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
                </button>
            </form>

            <p>
                มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
            </p>
        </div>
    )
}
