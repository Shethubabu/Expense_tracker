import type { ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type Props = {
  children: ReactNode
}

export const Layout = ({ children }: Props) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate() 

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-primary font-semibold"
      : "text-muted-foreground"

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="max-w-7xl mx-auto p-6 flex gap-6">

      
        <aside className="hidden md:flex flex-col w-64 bg-white rounded-xl shadow-md p-6 space-y-6">
          <h2 className="text-xl font-bold">Expense Tracker</h2>

          <nav className="flex flex-col gap-3 text-sm">
            {user?.role === "admin" && (
              <button
                onClick={() => handleNavigate("/admin")}
                className={isActive("/admin")}
              >
                Dashboard
              </button>
            )}

            {user?.role === "user" && (
              <>
                <button
                  onClick={() => handleNavigate("/dashboard")}
                  className={isActive("/dashboard")}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavigate("/transactions")}
                  className={isActive("/transactions")}
                >
                  Transactions
                </button>
              </>
            )}
          </nav>

          <div className="mt-auto">
            <Button
              variant="destructive"
              className="w-full"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col gap-6">

        
          <div className="md:hidden flex justify-between items-center bg-white rounded-xl shadow-md p-4">
            <h2 className="font-semibold">Expense Tracker</h2>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Menu
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {user?.role === "admin" && (
                  <DropdownMenuItem onClick={() => handleNavigate("/admin")}>
                    Dashboard
                  </DropdownMenuItem>
                )}

                {user?.role === "user" && (
                  <>
                    <DropdownMenuItem onClick={() => handleNavigate("/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigate("/transactions")}>
                      Transactions
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuItem
                  className="text-red-500"
                  onClick={logout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          
          <div className="bg-white rounded-xl shadow-md p-6">
            {children}
          </div>

        </main>
      </div>
    </div>
  )
}