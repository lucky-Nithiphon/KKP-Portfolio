import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "../firebase"
import { onAuthStateChanged } from "firebase/auth"
import type { User } from "firebase/auth"

// กำหนด type ของข้อมูลใน Context
interface AuthContextType {
    user: User | null        // User มาจาก firebase/auth
    token: string | null     // Token เป็น string หรือ null
    loading: boolean         // loading เป็น true/false
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const idToken = await firebaseUser.getIdToken()
                setUser(firebaseUser)
                setToken(idToken)
            } else {
                setUser(null)
                setToken(null)
            }
            setLoading(false)
        })
        return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={{ user, token, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)