import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="clay-topbar">
      <div className="topbar-welcome">
        <h2 className="topbar-greeting">
          Good morning! 👋
        </h2>
        <p className="topbar-subtitle">Here's what's happening with your career today.</p>
      </div>

      <div className="topbar-actions">
        {/* Floating Search Pill */}
        <form onSubmit={handleSearchSubmit} className="topbar-search-form">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search roles, skills, companies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="topbar-search-input"
          />
        </form>

        {/* Circular Notification Bell */}
        <button className="topbar-icon-btn" title="Notifications">
          <span className="bell-emoji">🔔</span>
          <span className="notification-dot" />
        </button>

        {/* User 3D Avatar */}
        <div className="topbar-user-profile" onClick={() => navigate('/profile')}>
          <div className="user-3d-avatar">{initials}</div>
        </div>
      </div>
    </header>
  )
}
