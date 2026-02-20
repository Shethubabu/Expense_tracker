import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { DatabaseProvider } from "@/context/DatabaseContext"
import { ProtectedRoute } from "@/components/layouts/ProtectedRoute";

import AuthPage from "./pages/AuthPage"
import UserDashboard from "./pages/UserDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import TransactionsPage from "./pages/TransactionsPage"
import UserDetails from "./pages/UserDetails"
import { Layout } from "@/components/layouts/Layout"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DatabaseProvider>
          <Routes>
            <Route path="/" element={<AuthPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="user">
                  <Layout>
                    <UserDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/transactions"
              element={
                <ProtectedRoute role="user">
                  <Layout>
                    <TransactionsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/user/:id"
              element={
                <ProtectedRoute role="admin">
                  <Layout>
                    <UserDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </DatabaseProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}