import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import * as appService from '../../services/applicationService'
import './Applications.css'

const STATUS_CONFIG = {
  APPLIED:     { label: 'Applied',     color: '#9ca6c2', bg: 'rgba(156,166,194,0.12)', icon: '📝' },
  REVIEWING:   { label: 'Reviewing',   color: '#6eb6f7', bg: 'rgba(110,182,247,0.12)', icon: '🔍' },
  SHORTLISTED: { label: 'Shortlisted', color: '#c9a84c', bg: 'rgba(201,168,76,0.12)',  icon: '⭐' },
  INTERVIEW:   { label: 'Interview',   color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: '🎙️' },
  REJECTED:    { label: 'Rejected',    color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: '✗' },
  HIRED:       { label: 'Hired! 🎉',   color: '#4caf8c', bg: 'rgba(76,175,140,0.15)',  icon: '🎉' },
}

export default function Applications() {
  const { token } = useAuth()
  const [apps, setApps]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    appService.getMyApplications(token)
      .then(data => setApps(data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  const stats = {
    total: apps.length,
    active: apps.filter(a => ['APPLIED','REVIEWING','SHORTLISTED','INTERVIEW'].includes(a.status)).length,
    hired: apps.filter(a => a.status === 'HIRED').length,
  }

  return (
    <div className="apps-page">
      <div className="apps-header">
        <div>
          <span className="eyebrow-label">Career Tracker</span>
          <h1 className="apps-title">My Applications</h1>
          <p className="apps-sub">Track the status of every job you've applied for.</p>
        </div>
        <Link to="/jobs" className="btn btn-primary" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
          Browse more jobs →
        </Link>
      </div>

      {/* Stats row */}
      {apps.length > 0 && (
        <div className="apps-stats">
          <div className="apps-stat-card">
            <div className="apps-stat-num">{stats.total}</div>
            <div className="apps-stat-label">Total applied</div>
          </div>
          <div className="apps-stat-card">
            <div className="apps-stat-num" style={{ color: '#6eb6f7' }}>{stats.active}</div>
            <div className="apps-stat-label">In progress</div>
          </div>
          <div className="apps-stat-card">
            <div className="apps-stat-num" style={{ color: '#4caf8c' }}>{stats.hired}</div>
            <div className="apps-stat-label">Hired 🎉</div>
          </div>
        </div>
      )}

      {error && <div className="apps-error">⚠️ {error}</div>}

      {loading ? (
        <div className="apps-list">
          {[1,2,3].map(i => <div key={i} className="app-skeleton" />)}
        </div>
      ) : apps.length === 0 ? (
        <div className="apps-empty">
          <div className="apps-empty-icon">📭</div>
          <h3>No applications yet</h3>
          <p>Start applying to jobs and track your progress here.</p>
          <Link to="/jobs" className="btn btn-primary" style={{ textDecoration: 'none' }}>Find jobs →</Link>
        </div>
      ) : (
        <div className="apps-list">
          {apps.map(app => {
            const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.APPLIED
            return (
              <div className="app-card" key={app.applicationId}>
                <div className="app-card-left">
                  <div className="app-status-indicator" style={{ background: cfg.bg, borderColor: cfg.color + '55' }}>
                    <span style={{ fontSize: '1.2rem' }}>{cfg.icon}</span>
                  </div>
                  <div className="app-info">
                    <div className="app-job-title">{app.jobTitle}</div>
                    <div className="app-job-meta">
                      {app.companyName} {app.location && `· ${app.location}`}
                    </div>
                    <div className="app-date">
                      Applied {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                    </div>
                  </div>
                </div>
                <div className="app-card-right">
                  <span className="app-status-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44` }}>
                    {cfg.label}
                  </span>
                  <Link to={`/jobs/${app.jobId}`} className="app-view-link">View job →</Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
