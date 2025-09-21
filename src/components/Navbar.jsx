import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Activity, User, FileText, LogOut, TestTube } from "lucide-react"

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">HealthInsight</span>
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/dashboard")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/biomarkers"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/biomarkers")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <TestTube className="h-4 w-4" />
                  <span>Add report Data</span>
                </Link>

                <Link
                  to="/profile"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/profile")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>

                <div className="flex items-center space-x-3">
                  <img
                    src={user?.profilePicture || "/placeholder.svg"}
                    alt={user?.firstName}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm text-muted-foreground">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary px-4 py-2">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
