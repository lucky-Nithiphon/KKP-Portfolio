import { useEffect, useRef } from "react"
import "./PortfolioModal.css"

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
    description?: string
}

interface PortfolioModalProps {
    portfolio: Portfolio | null
    isLoggedIn: boolean
    onClose: () => void
}

export default function PortfolioModal({ portfolio, isLoggedIn, onClose }: PortfolioModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)

    // ── ปิดด้วย Esc ──
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        if (portfolio) {
            document.addEventListener("keydown", handler)
            document.body.style.overflow = "hidden"
        }
        return () => {
            document.removeEventListener("keydown", handler)
            document.body.style.overflow = ""
        }
    }, [portfolio, onClose])

    if (!portfolio) return null

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) onClose()
    }

    const handleOpenPortfolio = () => {
        window.open(portfolio.portfolioLink, "_blank")
    }

    return (
        <div
            ref={overlayRef}
            className="pm-overlay"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-label={`Portfolio ของ ${portfolio.fullName}`}
        >
            <div className="pm-modal">

                {/* ── Cover Image ── */}
                <div className="pm-cover">
                    {portfolio.coverprom ? (
                        <img
                            src={portfolio.coverprom}
                            alt={`หน้าปก Portfolio ของ ${portfolio.fullName}`}
                            className="pm-cover-img"
                        />
                    ) : (
                        <div className="pm-cover-placeholder">
                            <span>ไม่มีรูปหน้าปก</span>
                        </div>
                    )}
                    <button
                        className="pm-close"
                        onClick={onClose}
                        aria-label="ปิด"
                    >
                        ✕
                    </button>
                    <div className="pm-accent-bar" />
                </div>

                {/* ── Scrollable Body ── */}
                <div className="pm-body">
                    <div className="pm-inner">

                        {/* Header */}
                        <div className="pm-header">
                            <div className="pm-title-block">
                                <div className="pm-univ-label">
                                    {portfolio.university.toUpperCase()}
                                </div>
                                <h2 className="pm-name">{portfolio.fullName}</h2>
                                <p className="pm-nick">ชื่อเล่น: {portfolio.nickname}</p>
                            </div>
                            <div className="pm-badges">
                                <span className="pm-badge pm-badge-year">
                                    รุ่น พ.ศ. {portfolio.graduationYear}
                                </span>
                                <span className="pm-badge pm-badge-fac">
                                    {portfolio.Sakaname}
                                </span>
                            </div>
                        </div>

                        {/* Meta Grid */}
                        <div className="pm-meta-grid">
                            <div className="pm-meta-item">
                                <div className="pm-meta-label">คณะ</div>
                                <div className="pm-meta-value">{portfolio.Kananame}</div>
                            </div>
                            <div className="pm-meta-item">
                                <div className="pm-meta-label">สาขาวิชา</div>
                                <div className="pm-meta-value">{portfolio.Sakaname}</div>
                            </div>
                            <div className="pm-meta-item">
                                <div className="pm-meta-label">มหาวิทยาลัย</div>
                                <div className="pm-meta-value">{portfolio.university}</div>
                            </div>
                            <div className="pm-meta-item">
                                <div className="pm-meta-label">ปีที่จบ (พ.ศ.)</div>
                                <div className="pm-meta-value">{portfolio.graduationYear}</div>
                            </div>
                        </div>

                        <div className="pm-divider" />

                        {/* Description */}
                        <div className="pm-desc-label">คำอธิบายจากผู้แชร์</div>
                        <div className="pm-desc-text">
                            {portfolio.description
                                ? portfolio.description
                                : <span className="pm-desc-empty">ผู้แชร์ยังไม่ได้เพิ่มคำอธิบาย</span>
                            }
                        </div>

                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="pm-footer">
                    <div className="pm-footer-note">
                        {isLoggedIn
                            ? <span className="pm-logged-in">✓ เข้าสู่ระบบแล้ว</span>
                            : <span className="pm-not-logged">กรุณาเข้าสู่ระบบก่อน</span>
                        }
                    </div>

                    {isLoggedIn ? (
                        <button className="pm-btn-portal" onClick={handleOpenPortfolio}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            เปิด Portfolio
                        </button>
                    ) : (
                        <button
                            className="pm-btn-lock"
                            onClick={() => alert("กรุณาเข้าสู่ระบบก่อนครับ")}
                        >
                            🔒 Login เพื่อดู Portfolio
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}
