import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import * as jobService from '../../services/jobService'
import * as appService from '../../services/applicationService'
import './JobDetail.css'

const TYPE_LABELS = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time',
  INTERNSHIP: 'Internship', CONTRACT: 'Contract', REMOTE: 'Remote',
}
const TYPE_COLORS = {
  FULL_TIME: '#4c9c82', PART_TIME: '#6eb6f7', INTERNSHIP: '#a78bfa',
  CONTRACT: '#f59e0b', REMOTE: '#c9a84c',
}

function CompanyAvatar({ name, size = 64 }) {
  const initials = name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '?'
  const colors = ['#4c9c82','#6eb6f7','#a78bfa','#f59e0b','#c9a84c','#f87171','#34d399']
  const bg = colors[(name?.charCodeAt(0) || 0) % colors.length]
  return (
    <div className="company-avatar-lg" style={{ background: bg, width: size, height: size, fontSize: size * 0.35 }}>
      {initials}
    </div>
  )
}

export default function JobDetail() {
  const { id } = useParams()
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob]       = useState(null)
  const [saved, setSaved]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const [showApply, setShowApply]     = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [resume, setResume]   = useState(null)
  const [applying, setApplying]       = useState(false)
  const [applyError, setApplyError]   = useState('')
  const [appliedOk, setAppliedOk]     = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [j, s] = await Promise.all([
          jobService.getJob(id, token),
          token ? jobService.isSaved(token, id) : Promise.resolve({ saved: false }),
        ])
        setJob(j); setSaved(s?.saved ?? false)
      } catch (e) { setError(e.message) }
      finally { setLoading(false) }
    }
    load()
  }, [id, token])

  const handleSave = async () => {
    if (!token) { navigate('/login'); return }
    const res = await jobService.toggleSave(token, id)
    setSaved(res.saved)
  }

  const handleApply = async (e) => {
    e.preventDefault()
    if (!token) { navigate('/login'); return }
    setApplying(true); setApplyError('')
    try {
      await appService.applyForJob(token, id, { coverLetter, resume })
      setAppliedOk(true); setShowApply(false)
    } catch (err) { setApplyError(err.message) }
    finally { setApplying(false) }
  }

  if (loading) return (
    <div className="jd-skeleton">
      <div className="jd-skeleton-header" />
      <div className="jd-skeleton-body" />
    </div>
  )
  if (error) return <div className="jd-error">⚠️ {error} <Link to="/jobs">← Back to jobs</Link></div>
  if (!job) return null

  const isOwner = user?.role === 'RECRUITER' && user?.userId === job.posterId
  const typeColor = TYPE_COLORS[job.jobType] || '#c9a84c'

  return (
    <div className="jd-page">
      {/* Back */}
      <Link to="/jobs" className="jd-back">← Back to Jobs</Link>

      {/* Hero card */}
      <div className="jd-hero card">
        <div className="jd-hero-left">
          <CompanyAvatar name={job.companyName} size={72} />
          <div>
            <span className="jd-type-pill" style={{ color: typeColor, borderColor: typeColor + '44', background: typeColor + '18' }}>
              {TYPE_LABELS[job.jobType] || job.jobType}
            </span>
            <h1 className="jd-title">{job.jobTitle}</h1>
            <div className="jd-meta">
              <span className="jd-meta-item">🏢 {job.companyName}</span>
              <span className="jd-meta-sep">·</span>
              <span className="jd-meta-item">📍 {job.location}</span>
              {job.salaryMin && <>
                <span className="jd-meta-sep">·</span>
                <span className="jd-meta-item jd-salary">
                  💰 ₹{(job.salaryMin/100000).toFixed(1)}L{job.salaryMax ? `–₹${(job.salaryMax/100000).toFixed(1)}L` : '+'}
                </span>
              </>}
              {job.experienceRequired && <>
                <span className="jd-meta-sep">·</span>
                <span className="jd-meta-item">🏅 {job.experienceRequired}</span>
              </>}
            </div>
            <div className="jd-posted">
              Posted {job.postedDate ? new Date(job.postedDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) : '—'}
            </div>
          </div>
        </div>

        <div className="jd-hero-actions">
          <button className={`jd-save-btn ${saved ? 'is-saved' : ''}`} onClick={handleSave}>
            {saved ? '♥ Saved' : '♡ Save'}
          </button>
          {!isOwner && job.open && (
            appliedOk
              ? <div className="jd-applied-badge">✅ Application submitted!</div>
              : <button className="btn btn-primary" onClick={() => setShowApply(true)}>Apply Now →</button>
          )}
          {!job.open && <div className="jd-closed-badge">🔒 Applications closed</div>}
          {isOwner && (
            <Link to={`/recruiter/jobs/${id}/applicants`} className="btn btn-ghost" style={{ textDecoration: 'none' }}>
              👥 View Applicants
            </Link>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="jd-body">
        {job.description && (
          <section className="card jd-section">
            <h2 className="jd-section-title">📋 About the Role</h2>
            <p className="jd-section-text">{job.description}</p>
          </section>
        )}
        {job.requirements && (
          <section className="card jd-section">
            <h2 className="jd-section-title">✅ Requirements</h2>
            <p className="jd-section-text">{job.requirements}</p>
          </section>
        )}
        {!job.description && !job.requirements && (
          <div className="card jd-section">
            <p style={{ color: 'var(--color-ink-muted)' }}>No further details provided by the recruiter.</p>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApply && (
        <div className="modal-backdrop" onClick={() => setShowApply(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Apply for {job.jobTitle}</h2>
                <p className="modal-sub">{job.companyName} · {job.location}</p>
              </div>
              <button className="modal-close" onClick={() => setShowApply(false)}>✕</button>
            </div>
            <form onSubmit={handleApply} className="modal-form">
              <div className="modal-field">
                <label className="modal-label">Cover letter <span className="optional">(optional)</span></label>
                <textarea
                  className="modal-textarea"
                  rows={5}
                  placeholder="Tell the recruiter why you're a great fit for this role…"
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">Resume / CV <span className="optional">(optional, PDF/DOC)</span></label>
                <div className="file-upload-area">
                  <input type="file" accept=".pdf,.doc,.docx" id="resume-upload"
                    style={{ display: 'none' }} onChange={e => setResume(e.target.files[0])} />
                  <label htmlFor="resume-upload" className="file-upload-label">
                    {resume ? `📎 ${resume.name}` : '📂 Click to upload resume'}
                  </label>
                </div>
              </div>
              {applyError && <div className="modal-error">⚠️ {applyError}</div>}
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowApply(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={applying}>
                  {applying ? 'Submitting…' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
