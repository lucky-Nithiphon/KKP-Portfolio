import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { auth } from "../firebase"
import axios from "axios"

interface Portfolio {
    id: string
    fullName: string
    nickname: string
    graduationYear: number
    Kananame: string
    Sakaname: string
    university: string
    portfolioLink: string
    coverprom: string
}

export default function HomePage() {
    const { user, loading: authLoading } = useAuth()
    const [portfolios, setPortfolios] = useState<Portfolio[]>([])
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const response = await axios.get("http://localhost:8000/portfolios/")
                setPortfolios(response.data)
            } catch (err) {
                console.error("Fetch error:", err)
                setError("ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อ Backend")
            } finally {
                setFetching(false)
            }
        }
        fetchPortfolios()
    }, [])

    const handleLogout = async () => {
        try {
            await auth.signOut()
            navigate("/")
        } catch (err) {
            console.error("Logout error", err)
        }
    }

    const handleViewPortfolio = (url: string) => {
        if (!user) {
            // ถ้ายังไม่ login ให้ไปหน้า login
            alert("กรุณาเข้าสู่ระบบก่อนเข้าชม Portfolio ครับ")
            navigate("/login")
            return
        }
        // ถ้า login แล้ว ให้เปิดลิงก์ใหม่
        window.open(url, "_blank")
    }

    // เราจะไม่บล็อกทั้งหน้าด้วย authLoading แล้ว เพื่อให้หน้าเว็บขึ้นโครงสร้างมาก่อน
    return (
        <div className="home-container">
            {/* Navbar */}
            <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f0f0f0', marginBottom: '2rem' }}>
                <div className="logo">
                    <h1 style={{ margin: 0 }}>KKP Portfolio</h1>
                </div>
                <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* ปุ่มแชร์ Portfolio เพิ่มไว้ให้ทุกคนเห็น */}
                    <button 
                        onClick={() => navigate("/add-portfolio")} 
                        style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        ➕ แชร์ Portfolio
                    </button>

                    {!authLoading && ( 
                        user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span>สวัสดีคุณ, <strong>{user.displayName || user.email}</strong></span>
                                <button onClick={handleLogout} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                                    ออกจากระบบ
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>เข้าสู่ระบบ</Link>
                                <Link to="/register" style={{ textDecoration: 'none', color: '#28a745' }}>สมัครสมาชิก</Link>
                            </div>
                        )
                    )}
                </div>
            </nav>

            <h2>Portfolio ทั้งหมด</h2>

            {fetching ? (
                <div>กำลังโหลดข้อมูล Portfolio...</div>
            ) : error ? (
                <div style={{ color: 'red', padding: '1rem', border: '1px solid red' }}>{error}</div>
            ) : portfolios.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed #ccc' }}>
                    <h3>ยังไม่มีข้อมูล Portfolio ในระบบ</h3>
                    <p>มาเป็นคนแรกที่แชร์ผลงานของคุณ!</p>
                </div>
            ) : (
                <div className="portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {portfolios.map((portfolio) => (
                        <div key={portfolio.id} className="portfolio-card" style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', paddingBottom: '1rem' }}>
                            <img
                                src={portfolio.coverprom}
                                alt={portfolio.fullName}
                                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                            />
                            <div className="portfolio-info" style={{ padding: '1rem' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0' }}>{portfolio.fullName}</h3>
                                <p style={{ margin: '0.2rem 0' }}>🎓 ปีที่จบ: {portfolio.graduationYear}</p>
                                <p style={{ margin: '0.2rem 0' }}>🏛️ {portfolio.university}</p>
                                <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#666' }}>
                                    {portfolio.Kananame} - {portfolio.Sakaname}
                                </p>

                                <button
                                    onClick={() => handleViewPortfolio(portfolio.portfolioLink)}
                                    style={{
                                        marginTop: '1rem',
                                        width: '100%',
                                        padding: '10px',
                                        background: user ? '#28a745' : '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {user ? "ดู Portfolio" : "🔒 Login เพื่อดู"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}