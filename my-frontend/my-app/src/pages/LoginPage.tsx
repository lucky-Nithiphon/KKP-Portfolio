import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate , Link} from "react-router-dom";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()
        setError("")
        setLoading(true)

        try{
            
            const response =  await axios.post("http://localhost:8000/auth/login",{
                email: email,
                password: password
            });
            const customToken = response.data.token;
            await signInWithCustomToken( auth, customToken)
            
            navigate("/")

        } catch (err){
            setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
        } finally{
            setLoading(false)
        }
    }

    return (
         <div className="login-container">
            <h2>เข้าสู่ระบบ</h2>
            
            {/* แสดง error ถ้ามี */}
            {error && <p className="error">{error}</p>}
            
            <form onSubmit={handleSubmit}>
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
                    {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </button>
            </form>

            <p>
                ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
            </p>
        </div>
    )
    
}
