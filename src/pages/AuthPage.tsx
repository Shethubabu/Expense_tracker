import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AuthPage() {
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  })

  const handleSubmit = () => {
    if (isLogin) {
      const ok = login(form.email, form.password)
      if (ok) navigate(form.role === "admin" ? "/admin" : "/dashboard")
      else alert("Invalid credentials")
    } else {
      if (!form.name || !form.email || !form.password) {
        alert("Please fill all fields")
        return
      }
      const ok = signup(form as any)
      if (ok) navigate(form.role === "admin" ? "/admin" : "/dashboard")
      else alert("Email already exists")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <Card className="p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Signup"}
        </h2>

        {!isLogin && (
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your Name"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Your Email"
          />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
          />
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(val) => setForm({ ...form, role: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button className="w-full mt-2" onClick={handleSubmit}>
          {isLogin ? "Login" : "Signup"}
        </Button>

        <Button
          variant="link"
          className="w-full mt-2"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Switch to Signup" : "Switch to Login"}
        </Button>
      </Card>
    </div>
  )
}