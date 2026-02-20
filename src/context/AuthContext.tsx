import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { User } from "@/types"
import {
  getDB,
  createUser,
  saveSession,
  getSession,
  clearSession,
} from "@/uitils/storage"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => boolean
  signup: (data: Omit<User, "id">) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  
  useEffect(() => {
    const sessionUserId = getSession()
    if (!sessionUserId) return

    const db = getDB()
    const existingUser = db.users[sessionUserId]

    if (existingUser) {
      setUser(existingUser)
    }
  }, [])

  
  const login = useCallback((email: string, password: string) => {
    const db = getDB()

    
    const users = db.users

    for (const id in users) {
      const u = users[id]
      if (u.email === email && u.password === password) {
        saveSession(u.id)
        setUser(u)
        return true
      }
    }

    return false
  }, [])

 
  const signup = useCallback((data: Omit<User, "id">) => {
    const db = getDB()

    
    for (const id in db.users) {
      if (db.users[id].email === data.email) {
        return false
      }
    }

    const newUser = createUser(data)

    saveSession(newUser.id)
    setUser(newUser)

    return true
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
    }),
    [user, login, signup, logout]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}