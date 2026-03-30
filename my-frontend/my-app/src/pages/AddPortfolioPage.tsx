import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const faculties = [
    "คณะบริหารธุรกิจ", "คณะเศรษฐศาสตร์", "คณะบัญชี", "คณะวิศวกรรมศาสตร์",
    "คณะนิติศาสตร์", "คณะนิเทศศาสตร์", "คณะอักษรศาสตร์", "คณะดุริยางค์-นาฏศิลป์",
    "คณะธุรกิจการบิน", "คณะจิตวิทยา", "คณะแพทยศาสตร์", "คณะทันตแพทยศาสตร์",
    "คณะสัตวแพทยศาสตร์", "คณะเภสัชศาสตร์", "คณะพยาบาล", "คณะวิทยาศาสตร์การกีฬา",
    "คณะสหเวชศาสตร์", "คณะการท่องเที่ยวและการโรงแรม", "คณะเทคโนโลยีสารสนเทศ",
    "คณะสถาปัตยกรรมศาสตร์", "คณะศิลปกรรมศาสตร์", "คณะครุศาสตร์",
    "คณะรัฐศาสตร์", "คณะวิทยาศาสตร์", "คณะมนุษยศาสตร์"
]

export default function AddPortfolioPage() {
    const { token } = useAuth()
    const navigate = useNavigate()

    const [ formData, setFormData] = useState({
        fullName: "",
        nickname: "",
        graduationYear: new Date().getFullYear() + 543, 
        Kananame: faculties[3], // Default: วิศวกรรมศาสตร์
        Sakaname: "",
        university: "",
        portfolioLink: ""
    })

    const [file, setFile] = useState<File | null > (null)
    const [loading, setLoading] = useState(false)

    // ฟังก์ชันบีบอัดและแปลงรูปภาพเป็น Base64
    const processImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    
                    // ปรับขนาดใหญ่ขึ้นและคงสัดส่วน
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 1200; // เพิ่มจาก 600 เป็น 1200
                    const MAX_HEIGHT = 1200; // เพิ่มจากไม่มีเป็น 1200
                    
                    // คำนวณขนาดใหม่โดยคงสัดส่วน
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = (height * MAX_WIDTH) / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = (width * MAX_HEIGHT) / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // ปรับคุณภาพเป็น 0.8 (80%) เพื่อความชัดที่ดีขึ้น
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(dataUrl);
                };
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return alert("กรุณาเลือกรูปภาพหน้าปกด้วยครับ")

        setLoading(true)
        try{
            // 1. แปลงและบีบอัดรูปภาพเป็น Base64
            const base64Image = await processImage(file);

            // 2. ส่งข้อมูลเป็น JSON ธรรมดา (ไม่ใช่ FormData แล้ว)
            const payload = {
                ...formData,
                coverprom: base64Image // ส่งตัวหนังสือรูปภาพไปเลย
            };

            await axios.post("http://localhost:8000/portfolios/", payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : ""
                }
            })

            alert("เพิ่ม Portfolio สำเร็จ! (บันทึกแบบ Base64)")
            navigate("/")
        } catch (err) {
            console.error(err)
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลดขนาดรูปภาพลง")
        } finally {
            setLoading(false)
        }
    }

    return (
           <div className="add-portfolio-container" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
               <button onClick={() => navigate("/")} style={{ marginBottom: '1rem', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>← กลับหน้าหลัก</button>
               <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>แชร์ Portfolio ของคุณ</h2>
               
               <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>ชื่อ-นามสกุล *</label>
                    <input
                        style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="เช่น นายกุดข้าวปุ้น รักเรียน"
                        required
                    />
                </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label>ชื่อเล่น *</label>
                       <input
                           style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                           type="text"
                           value={formData.nickname}
                           onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                           placeholder="เช่น นนท์"
                           required
                       />
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label>ปีที่จบการศึกษา (พ.ศ.) *</label>
                       <input
                           style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                           type="number"
                           min="2500"
                           max="2600"
                           value={formData.graduationYear}
                           onChange={(e) => setFormData({...formData, graduationYear: parseInt(e.target.value)})}
                           required
                       />
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label>คณะ *</label>
                       <select
                           style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                           value={formData.Kananame}
                           onChange={(e) => setFormData({...formData, Kananame: e.target.value})}
                           required
                       >
                           {faculties.map((fac) => (
                               <option key={fac} value={fac}>{fac}</option>
                           ))}
                       </select>
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label>สาขาวิชา *</label>
                       <input
                           style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                           type="text"
                           value={formData.Sakaname}
                           onChange={(e) => setFormData({...formData, Sakaname: e.target.value})}
                           placeholder="เช่น วิศวกรรมคอมพิวเตอร์"
                           required
                       />
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label>มหาวิทยาลัย *</label>
                       <input
                           style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                           type="text"
                           value={formData.university}
                           onChange={(e) => setFormData({...formData, university: e.target.value})}
                           placeholder="เช่น มหาวิทยาลัยขอนแก่น"
                           required
                       />
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label>ลิงก์ Portfolio (Canva/Google Drive) *</label>
                       <input
                           style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                           type="url"
                           value={formData.portfolioLink}
                           onChange={(e) => setFormData({...formData, portfolioLink: e.target.value})}
                           placeholder="https://www.canva.com/..."
                           required
                       />
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label>รูปหน้าปก Portfolio *</label>
                       <input 
                            type="file" 
                            onChange={(e) => setFile(e.target.files?.[0] || null)} 
                            accept="image/*" 
                            required 
                        />
                        <small style={{ color: '#666' }}>แนะนำ: ขนาดไม่เกิน 5MB</small>
                   </div>

                   <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            padding: '12px', 
                            borderRadius: '5px', 
                            border: 'none', 
                            background: loading ? '#ccc' : '#28a745', 
                            color: 'white', 
                            fontWeight: 'bold', 
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                       {loading ? "กำลังบันทึกข้อมูล..." : "🚀 ยืนยันการแชร์ Portfolio"}
                   </button>
               </form>
           </div>
       )
}


