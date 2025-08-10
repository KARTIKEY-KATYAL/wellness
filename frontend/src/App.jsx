import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import MySessionsPage from './pages/MySessionsPage'
import EditorPage from './pages/EditorPage'
import { AuthProvider, useAuth } from './context/AuthContext'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function Layout({ children }) {
  const { token, logout } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <Link to="/" className="font-semibold">Wellness</Link>
        <nav className="flex gap-3">
          <Link to="/">Dashboard</Link>
          {token && <Link to="/my-sessions">My Sessions</Link>}
          {token ? (
            <button onClick={logout} className="text-red-600">Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main className="p-4 max-w-4xl mx-auto">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
          <Route path="/my-sessions" element={<PrivateRoute><Layout><MySessionsPage /></Layout></PrivateRoute>} />
          <Route path="/editor/:id?" element={<PrivateRoute><Layout><EditorPage /></Layout></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
