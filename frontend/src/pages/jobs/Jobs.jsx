import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import * as jobService from '../../services/jobService'
import './Jobs.css'

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'REMOTE']
const TYPE_LABELS = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time',
  INTERNSHIP: 'Internship', CONTRACT: 'Contract', REMOTE: 'Remote',
}
const TYPE_COLORS = {
  FULL_TIME: '#4c9c82', PART_TIME: '#6eb6f7', INTERNSHIP: '#a78bfa',
  CONTRACT: '#f59e0b', REMOTE: '#c9a84c',
}

function CompanyAvatar({ name }) {
  const initials = name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '?'
  const colors = ['#4c9c82','#6eb6f7','#a78bfa','#f59e0b','#c9a84c','#f87171','#34d399']
  const bg = colors[(name?.charCodeAt(0) || 0) % colors.length]
  return (
    <div className="company-avatar" style={{ background: bg }}>{initials}</div>
  )
}

export default function Jobs() {
  const { token, user } = useAuth()
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [saved, setSaved]     = useState(new Set())
  const [search, setSearch]   = useState('')
  const [location, setLocation] = useState('')
  const [type, setType]       = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const [list, savedList] = await Promise.all([
        jobService.listJobs({ search, location, type }),
        token ? jobService.getSavedJobs(token) : Promise.resolve([]),
      ])
      setJobs(list || [])
      setSaved(new Set((savedList || []).map(j => j.jobId)))
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [search, location, type, token])

  useEffect(() => { load() }, [load])

  const handleSave = async (e, jobId) => {
    e.preventDefault(); e.stopPropagation()
    if (!token) return
    const res = await jobService.toggleSave(token, jobId)
    setSaved(prev => { const n = new Set(prev); res.saved ? n.add(jobId) : n.delete(jobId); return n })
  }

  return (
    <div className="jobs-page">

      {/* Hero */}
      <div className="jobs-hero">
        <div className="jobs-hero-inner">
          <span className="jobs-hero-eyebrow">🚀 Live Opportunities</span>
          <h1 className="jobs-hero-title">Find your next<br /><span className="accent-text">dream job</span></h1>
          <p className="jobs-hero-sub">Browse {jobs.length > 0 ? `${jobs.length}+ ` : ''}open positions across top companies.</p>
          {user?.role === 'RECRUITER' && (
            <Link to="/jobs/post" className="btn btn-primary jobs-hero-cta">+ Post a Job</Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="jobs-filter-bar">
        <div className="filter-search-wrap">
          <span className="filter-icon">🔍</span>
          <input className="filter-input" placeholder="Search title, company, keyword…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-search-wrap">
          <span className="filter-icon">📍</span>
          <input className="filter-input" placeholder="City, state, or remote…"
            value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <select className="filter-select" value={type} onChange={e => setType(e.target.value)}>
          <option value="">All job types</option>
          {JOB_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
        </select>
        {(search || location || type) && (
          <button className="filter-clear" onClick={() => { setSearch(''); setLocation(''); setType('') }}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Count */}
      {!loading && !error && (
        <div className="jobs-count">
          {jobs.length === 0 ? 'No jobs found' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found`}
        </div>
      )}

      {error && <div className="jobs-error">⚠️ {error}</div>}

      {loading ? (
        <div className="jobs-skeleton-grid">
          {[1,2,3,4,5,6].map(i => <div key={i} className="job-card-skeleton" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="jobs-empty-state">
          <div className="jobs-empty-icon">🔭</div>
          <h3>No positions found</h3>
          <p>Try adjusting your search filters or check back later for new openings.</p>
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setLocation(''); setType('') }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <Link to={`/jobs/${job.jobId}`} className="job-card" key={job.jobId}>
              <div className="job-card-header">
                <CompanyAvatar name={job.companyName} />
                <div className="job-card-header-info">
                  <div className="job-card-company">{job.companyName}</div>
                  <div className="job-card-location">📍 {job.location}</div>
                </div>
                {token && (
                  <button
                    className={`job-save-btn ${saved.has(job.jobId) ? 'is-saved' : ''}`}
                    onClick={(e) => handleSave(e, job.jobId)}
                    title={saved.has(job.jobId) ? 'Remove from saved' : 'Save job'}
                  >
                    {saved.has(job.jobId) ? '♥' : '♡'}
                  </button>
                )}
              </div>

              <div className="job-card-body">
                <h3 className="job-card-title">{job.jobTitle}</h3>
                {job.description && (
                  <p className="job-card-desc">{job.description.slice(0, 100)}{job.description.length > 100 ? '…' : ''}</p>
                )}
              </div>

              <div className="job-card-footer">
                <div className="job-card-tags">
                  <span className="job-tag" style={{ color: TYPE_COLORS[job.jobType], borderColor: TYPE_COLORS[job.jobType] + '44', background: TYPE_COLORS[job.jobType] + '18' }}>
                    {TYPE_LABELS[job.jobType] || job.jobType}
                  </span>
                  {job.experienceRequired && (
                    <span className="job-tag job-tag-neutral">🏅 {job.experienceRequired}</span>
                  )}
                </div>
                {job.salaryMin && (
                  <div className="job-card-salary">
                    ₹{(job.salaryMin / 100000).toFixed(1)}L{job.salaryMax ? `–${(job.salaryMax / 100000).toFixed(1)}L` : '+'}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
