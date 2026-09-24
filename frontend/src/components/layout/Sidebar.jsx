import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const CANDIDATE_SECTIONS = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/jobs', label: 'Browse Jobs', icon: '💼' },
  { path: '/applications', label: 'Applications', icon: '📄' },
  { path: '/profile', label: 'My Profile', icon: '👤' },
  { path: '/careers', label: 'Careers', icon: '🧭' },
  { path: '/roadmap', label: 'Roadmap', icon: '🗺️' },
  { path: '/resume', label: 'Resume Builder', icon: '📝' },
  { path: '/interview', label: 'Interview Prep', icon: '🎙️' }
]

const RECRUITER_SECTIONS = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/jobs', label: 'Browse Jobs', icon: '💼' },
  { path: '/jobs/post', label: 'Post a Job', icon: '➕' },
  { path: '/jobs/recruiter', label: 'My Listings', icon: '📋' },
  { path: '/profile', label: 'My Profile', icon: '👤' }
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, token } = useAuth()
  const navigate = useNavigate()
  const sections = user?.role === 'RECRUITER' ? RECRUITER_SECTIONS : CANDIDATE_SECTIONS

  const handleRoleSwitch = async () => {
    try {
      const newRole = user?.role === 'RECRUITER' ? 'USER' : 'RECRUITER'
      await fetch(`http://localhost:8080/api/users/me/role?role=${newRole}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      logout()
      navigate('/login')
    } catch (err) {
      console.error("Failed to switch role", err)
      alert("Error switching role")
    }
  }

  return (
    <aside className={`clay-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div className="sidebar-logo-icon">
          <span>⚡</span>
        </div>
        <span className="sidebar-brand-text">CareerSphere</span>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav-list">
        {sections.map(s => (
          <NavLink 
            key={s.path} 
            to={s.path} 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="sidebar-item-icon">{s.icon}</span>
            <span className="sidebar-item-label">{s.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* 3D Clay Promo Card */}
      <div className="sidebar-promo-card">
        <div className="promo-badge">🚀 Pro Tips</div>
        <h4>Ace Your Dream Job!</h4>
        <p>Complete your roadmap to boost interview callbacks by 3x.</p>
        <button className="promo-btn" onClick={() => navigate('/roadmap')}>
          View Roadmap
        </button>
      </div>

      {/* Footer Role & Auth */}
      <div className="sidebar-bottom-controls">
        <div className="role-tag-pill">
          <span className="role-dot" />
          <span>{user?.role === 'RECRUITER' ? 'Recruiter Mode' : 'Candidate Mode'}</span>
        </div>
        <button onClick={handleRoleSwitch} className="sidebar-role-btn">
          Switch to {user?.role === 'RECRUITER' ? 'Candidate' : 'Recruiter'}
        </button>
        <button onClick={() => { logout(); onClose(); }} className="sidebar-logout-btn">
          Sign out
        </button>
      </div>
    </aside>
  )
}
