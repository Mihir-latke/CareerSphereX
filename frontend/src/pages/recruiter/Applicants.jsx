import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import * as appService from '../../services/applicationService'
import './Applicants.css'

const STATUSES = ['APPLIED','REVIEWING','SHORTLISTED','INTERVIEW','REJECTED','HIRED']
const STATUS_CONFIG = {
  APPLIED:     { label: 'Applied',     color: '#9ca6c2' },
  REVIEWING:   { label: 'Reviewing',   color: '#6eb6f7' },
  SHORTLISTED: { label: 'Shortlisted', color: '#c9a84c' },
  INTERVIEW:   { label: 'Interview',   color: '#a78bfa' },
  REJECTED:    { label: 'Rejected',    color: '#f87171' },
  HIRED:       { label: 'Hired 🎉',   color: '#4caf8c' },
}

function Initials({ name }) {
  const letters = name ? name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase() : '?'
  const colors = ['#4c9c82','#6eb6f7','#a78bfa','#f59e0b','#c9a84c','#f87171']
  const bg = colors[(name?.charCodeAt(0)||0) % colors.length]
  return <div className="applicant-avatar" style={{ background: bg }}>{letters}</div>
}

export default function Applicants() {
  const { jobId } = useParams()
  const { token } = useAuth()
  const [apps, setApps]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    appService.getApplicants(token, jobId)
      .then(d => setApps(d || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [token, jobId])

  const handleStatus = async (appId, newStatus) => {
    setUpdating(appId)
    try {
      const updated = await appService.updateStatus(token, appId, newStatus)
      setApps(prev => prev.map(a => a.applicationId === appId ? { ...a, status: updated.status } : a))
    } catch (e) { setError(e.message) }
    finally { setUpdating(null) }
  }

  const jobTitle = apps[0]?.jobTitle
  const funnel = STATUSES.reduce((acc, s) => ({ ...acc, [s]: apps.filter(a => a.status === s).length }), {})

  return (
    <div className="applicants-page">
      <div className="applicants-header">
        <Link to="/recruiter/jobs" className="back-link">← My Jobs</Link>
        <div>
          <span className="eyebrow-label">Recruiter Hub</span>
          <h1 className="applicants-title">
            {jobTitle ? `Applicants — ${jobTitle}` : 'Applicants'}
          </h1>
          <p className="applicants-sub">{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Funnel */}
      {apps.length > 0 && (
        <div className="applicants-funnel">
          {STATUSES.map(s => (
            <div key={s} className="funnel-item">
              <div className="funnel-num" style={{ color: STATUS_CONFIG[s].color }}>{funnel[s]}</div>
              <div className="funnel-label">{STATUS_CONFIG[s].label}</div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="applicants-error">⚠️ {error}</div>}

      {loading ? (
        <div className="applicants-list">{[1,2,3,4].map(i=><div key={i} className="applicant-skeleton"/>)}</div>
      ) : apps.length === 0 ? (
        <div className="applicants-empty">
          <div style={{ fontSize:'2.5rem', marginBottom:'var(--space-4)' }}>👤</div>
          <h3>No applicants yet</h3>
          <p>Share the job listing to attract more candidates.</p>
        </div>
      ) : (
        <div className="applicants-list">
          {apps.map(app => {
            const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.APPLIED
            return (
              <div className="applicant-card" key={app.applicationId}>
                <Initials name={app.applicantName} />
                <div className="applicant-info">
                  <div className="applicant-name">{app.applicantName}</div>
                  <div className="applicant-email">{app.applicantEmail}</div>
                  {app.coverLetter && (
                    <p className="applicant-cover">{app.coverLetter.slice(0,100)}{app.coverLetter.length > 100 ? '…' : ''}</p>
                  )}
                  <div className="applicant-meta">
                    Applied {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                    {app.resumeUrl && (
                      <a href={`http://localhost:8080${app.resumeUrl}`} target="_blank" rel="noopener" className="resume-link">
                        📎 Download Resume
                      </a>
                    )}
                  </div>
                </div>
                <div className="applicant-actions">
                  <span className="current-status-dot" style={{ background: cfg.color }} />
                  <select
                    className="status-select"
                    value={app.status}
                    disabled={updating === app.applicationId}
                    style={{ borderColor: cfg.color + '66', color: cfg.color }}
                    onChange={e => handleStatus(app.applicationId, e.target.value)}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
