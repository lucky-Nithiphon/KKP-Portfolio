import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

// กำหนด type ของข้อมูล Portfolio
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
    const { user, token, loading } = useAuth()
    const [portfolios, setPortfolios] = useState<Portfolio[]>([])
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        // ถ้ายังโหลดสถานะ login อยู่ → รอก่อน
        if (loading) return

        // ถ้าไม่ได้ login → ไปหน้า login
        if (!user) {
            navigate("/login")
            return
        }

        // ถ้า login แล้ว → ดึงข้อมูล portfolios
        const fetchPortfolios = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/portfolios/",
                    {
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    }
                )
                setPortfolios(response.data)

            } catch (err) {
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูล")
            } finally {
                setFetching(false)
            }
        }

        fetchPortfolios()
    }, [user, token, loading])

    // ตอนกำลังตรวจสอบสถานะ login
    if (loading || fetching) {
        return <div>กำลังโหลด...</div>
    }

    // ถ้าเกิด error
    if (error) {
        return <div>{error}</div>
    }

    return (
        <div className="home-container">
            <h2>Portfolio ทั้งหมด</h2>

            {portfolios.length === 0 ? (
                <p>ยังไม่มีข้อมูล Portfolio</p>
            ) : (
                <div className="portfolio-grid">
                    {portfolios.map((portfolio) => (
                        <div key={portfolio.id} className="portfolio-card">
                            
                            {/* รูปปก */}
                            <img
                                src={portfolio.coverprom}
                                alt={portfolio.fullName}
                            />

                            {/* ข้อมูล */}
                            <div className="portfolio-info">
                                <h3>{portfolio.fullName}</h3>
                                <p>ชื่อเล่น: {portfolio.nickname}</p>
                                <p>คณะ: {portfolio.Kananame}</p>
                                <p>สาขา: {portfolio.Sakaname}</p>
                                <p>มหาวิทยาลัย: {portfolio.university}</p>
                                <p>ปีที่จบ: {portfolio.graduationYear}</p>
                                <Link
                                    to={portfolio.portfolioLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ดู Portfolio
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}