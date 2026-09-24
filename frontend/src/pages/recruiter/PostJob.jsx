import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import * as jobService from '../../services/jobService'
import './PostJob.css'

const JOB_TYPES = ['FULL_TIME','PART_TIME','INTERNSHIP','CONTRACT','REMOTE']
const TYPE_LABELS = { FULL_TIME:'Full-time', PART_TIME:'Part-time', INTERNSHIP:'Internship', CONTRACT:'Contract', REMOTE:'Remote' }

export default function PostJob() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    companyName:'', jobTitle:'', description:'', requirements:'',
    location:'', jobType:'FULL_TIME', salaryMin:'', salaryMax:'',
    experienceRequired:'', open: true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const payload = { ...form, salaryMin: form.salaryMin || null, salaryMax: form.salaryMax || null }
      await jobService.createJob(token, payload)
      navigate('/recruiter/jobs')
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="post-job-page">
      <div className="post-job-header">
        <span className="eyebrow-label">Recruiter Tools</span>
        <h1 className="post-job-title">Post a New Job</h1>
        <p className="post-job-sub">Fill in the details to attract the best candidates.</p>
      </div>

      <div className="post-job-grid">
        <form className="post-job-form card" onSubmit={handleSubmit}>
          <div className="form-section-title">Company & Role</div>
          <div className="form-row">
            <div className="form-field">
              <label>Company Name <span className="req">*</span></label>
              <input required value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="e.g. Acme Corp" />
            </div>
            <div className="form-field">
              <label>Job Title <span className="req">*</span></label>
              <input required value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder="e.g. Senior Frontend Developer" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Location <span className="req">*</span></label>
              <input required value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Bangalore / Remote" />
            </div>
            <div className="form-field">
              <label>Job Type <span className="req">*</span></label>
              <select value={form.jobType} onChange={e => set('jobType', e.target.value)}>
                {JOB_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
          </div>

          <div className="form-section-title" style={{ marginTop: 'var(--space-4)' }}>Compensation & Experience</div>
          <div className="form-row">
            <div className="form-field">
              <label>Min Salary (₹ LPA)</label>
              <input type="number" min="0" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} placeholder="e.g. 500000" />
            </div>
            <div className="form-field">
              <label>Max Salary (₹ LPA)</label>
              <input type="number" min="0" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} placeholder="e.g. 1200000" />
            </div>
          </div>
          <div className="form-field">
            <label>Experience Required</label>
            <input value={form.experienceRequired} onChange={e => set('experienceRequired', e.target.value)} placeholder="e.g. 2+ years, Fresher OK, 5-8 years" />
          </div>

          <div className="form-section-title" style={{ marginTop: 'var(--space-4)' }}>Job Details</div>
          <div className="form-field">
            <label>Job Description</label>
            <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the role, team, responsibilities, and what success looks like…" />
          </div>
          <div className="form-field">
            <label>Requirements / Skills</label>
            <textarea rows={4} value={form.requirements} onChange={e => set('requirements', e.target.value)} placeholder="List the required skills, qualifications, and must-haves…" />
          </div>

          <div className="form-toggle">
            <label className="toggle-label">
              <input type="checkbox" checked={form.open} onChange={e => set('open', e.target.checked)} />
              <span className="toggle-switch" />
              <span>{form.open ? '🟢 Accepting applications' : '🔴 Applications closed'}</span>
            </label>
          </div>

          {error && <div className="form-error">⚠️ {error}</div>}

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/recruiter/jobs')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Publishing…' : '🚀 Publish Job'}
            </button>
          </div>
        </form>

        {/* Preview card */}
        <div className="post-job-preview">
          <div className="preview-label">Live preview</div>
          <div className="preview-card card">
            <div className="preview-header">
              <div className="preview-avatar">{form.companyName ? form.companyName[0].toUpperCase() : '?'}</div>
              <div>
                <div className="preview-company">{form.companyName || 'Company Name'}</div>
                <div className="preview-location">📍 {form.location || 'Location'}</div>
              </div>
            </div>
            <div className="preview-title">{form.jobTitle || 'Job Title'}</div>
            {form.description && <p className="preview-desc">{form.description.slice(0,100)}{form.description.length > 100 ? '…' : ''}</p>}
            <div className="preview-footer">
              <span className="preview-type-pill">{TYPE_LABELS[form.jobType]}</span>
              {form.salaryMin && <span className="preview-salary">₹{(form.salaryMin/100000).toFixed(1)}L+</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
