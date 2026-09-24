import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import * as jobService from '../../services/jobService'
import './RecruiterJobs.css'

const TYPE_LABELS = { FULL_TIME:'Full-time', PART_TIME:'Part-time', INTERNSHIP:'Internship', CONTRACT:'Contract', REMOTE:'Remote' }

export default function RecruiterJobs() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    jobService.getMyJobs(token)
      .then(d => setJobs(d || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job listing permanently?')) return
    setDeleting(jobId)
    try {
      await jobService.deleteJob(token, jobId)
      setJobs(j => j.filter(x => x.jobId !== jobId))
    } catch (e) { setError(e.message) }
    finally { setDeleting(null) }
  }

  const openCount  = jobs.filter(j => j.open).length
  const closedCount = jobs.filter(j => !j.open).length

  return (
    <div className="rjobs-page">
      <div className="rjobs-header">
        <div>
          <span className="eyebrow-label">Recruiter Hub</span>
          <h1 className="rjobs-title">My Job Listings</h1>
          <p className="rjobs-sub">Manage your open positions and review applicants.</p>
        </div>
        <Link to="/jobs/post" className="btn btn-primary" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
          + Post New Job
        </Link>
      </div>

      {jobs.length > 0 && (
        <div className="rjobs-stats">
          <div className="rjob-stat"><span className="rjob-stat-num">{jobs.length}</span><span>Total</span></div>
          <div className="rjob-stat"><span className="rjob-stat-num" style={{ color: '#4caf8c' }}>{openCount}</span><span>Open</span></div>
          <div className="rjob-stat"><span className="rjob-stat-num" style={{ color: '#f87171' }}>{closedCount}</span><span>Closed</span></div>
        </div>
      )}

      {error && <div className="rjobs-error">⚠️ {error}</div>}

      {loading ? (
        <div className="rjobs-list">{[1,2,3].map(i => <div key={i} className="rjob-skeleton" />)}</div>
      ) : jobs.length === 0 ? (
        <div className="rjobs-empty">
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>📋</div>
          <h3>No job listings yet</h3>
          <p>Create your first listing to start finding talent.</p>
          <Link to="/jobs/post" className="btn btn-primary" style={{ textDecoration: 'none' }}>Post a job →</Link>
        </div>
      ) : (
        <div className="rjobs-list">
          {jobs.map(job => (
            <div className="rjob-card" key={job.jobId}>
              <div className="rjob-card-left">
                <div className="rjob-open-dot" style={{ background: job.open ? '#4caf8c' : '#f87171' }} title={job.open ? 'Open' : 'Closed'} />
                <div>
                  <div className="rjob-title">{job.jobTitle}</div>
                  <div className="rjob-meta">
                    {job.companyName} · {job.location} · {TYPE_LABELS[job.jobType] || job.jobType}
                    {job.postedDate && ` · Posted ${new Date(job.postedDate).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}`}
                  </div>
                </div>
              </div>
              <div className="rjob-card-actions">
                <Link to={`/recruiter/jobs/${job.jobId}/applicants`} className="rjob-btn rjob-btn-applicants">
                  👥 Applicants
                </Link>
                <Link to={`/jobs/${job.jobId}`} className="rjob-btn rjob-btn-view">View</Link>
                <button
                  className="rjob-btn rjob-btn-delete"
                  onClick={() => handleDelete(job.jobId)}
                  disabled={deleting === job.jobId}
                >
                  {deleting === job.jobId ? '…' : '🗑'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
