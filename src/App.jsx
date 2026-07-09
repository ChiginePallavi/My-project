import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Login from './pages/login/login.jsx'
import Footer from './components/Footer'
import './App.css'

export const appHighlights = [
  'Component-based structure',
  'Reusable props and buttons',
  'Vite-powered React app shell',
]

function App() {
  const [activePage, setActivePage] = useState('login')

  return (
    <div className="app-shell">
      <Navbar currentPage={activePage} onNavigate={setActivePage} />

      <div className="app-content">
        <Sidebar currentPage={activePage} onNavigate={setActivePage} />
        <div className="main-panel">
          {activePage === 'home' ? (
            <Home onNavigate={setActivePage} />
          ) : activePage === 'dashboard' ? (
            <Dashboard />
          ) : activePage === 'register' ? (
            <Register />
          ) : activePage === 'login' ? (
            <Login onNavigate={setActivePage} />
          ) : (
            <Home onNavigate={setActivePage} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default App
