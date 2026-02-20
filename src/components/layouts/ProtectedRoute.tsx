import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import type { JSX } from "react"

type Props = {
  children: JSX.Element
  role?: "admin" | "user"
}

export const ProtectedRoute = ({ children, role }: Props) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}