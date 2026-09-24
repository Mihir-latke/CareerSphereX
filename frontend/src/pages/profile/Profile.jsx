import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as profileService from '../../services/profileService'
import './Profile.css'

const EMPTY_FORM = { phone: '', dateOfBirth: '', location: '', education: '', degree: '', college: '', graduationYear: '', experienceYears: '', careerGoal: '', interests: '', bio: '' }

export default function Profile() {
  const { token, user } = useAuth()
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    profileService.getMyProfile(token)
      .then(data => {
        setForm({
          phone: data.phone || '', dateOfBirth: data.dateOfBirth || '',
          location: data.location || '', education: data.education || '',
          degree: data.degree || '', college: data.college || '',
          graduationYear: data.graduationYear ?? '', experienceYears: data.experienceYears ?? '',
          careerGoal: data.careerGoal || '', interests: data.interests || '', bio: data.bio || '',
        })
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError(''); setSaved(false)
    try {
      await profileService.updateMyProfile(token, {
        ...form,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : 0,
        dateOfBirth: form.dateOfBirth || null,
      })
      setSaved(true)
      setTimeout(() => setEditMode(false), 800)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const calcCompleteness = () => {
    const keys = Object.keys(EMPTY_FORM)
    const filled = keys.filter(k => !!form[k]).length
    return Math.round((filled / keys.length) * 100)
  }
  
  if (loading) return <div className="profile-skeleton" />

  const completeness = calcCompleteness()

  return (
    <div className="profile-page">
      <div className="profile-header">
        <span className="eyebrow-label">Your Route</span>
        <h1 className="profile-title">My Profile</h1>
      </div>

      <div className="profile-grid">
        {/* Left Column: Read-only summary card */}
        <div className="profile-summary card">
          <div className="summary-completeness">
            <span>Profile Completeness</span>
            <span>{completeness}%</span>
          </div>
          <div className="summary-progress-bar">
            <div className="summary-progress-fill" style={{ width: `${completeness}%` }} />
          </div>

          <div className="summary-avatar">
            {user?.name ? user.name[0].toUpperCase() : '?'}
          </div>
          
          <h2 className="summary-name">{user?.name}</h2>
          <p className="summary-email">{user?.email}</p>
          <span className={`summary-role-badge role-${user?.role?.toLowerCase()}`}>
            {user?.role === 'RECRUITER' ? '🏢 Recruiter' : '👤 Candidate'}
          </span>

          <div className="summary-details">
            <div className="summary-item">
              <strong>Location</strong> {form.location || '—'}
            </div>
            <div className="summary-item">
              <strong>Career Goal</strong> {form.careerGoal || '—'}
            </div>
            <div className="summary-item">
              <strong>Experience</strong> {form.experienceYears ? `${form.experienceYears} Years` : '—'}
            </div>
          </div>
          
          <div className="summary-bio">
            <strong>About</strong>
            <p>{form.bio || 'No bio provided yet.'}</p>
          </div>

          {!editMode && (
            <button className="btn btn-primary btn-block" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
        </div>

        {/* Right Column: Edit Form */}
        <div className={`profile-form-wrapper card ${editMode ? 'is-editing' : ''}`}>
          {!editMode ? (
            <div className="profile-form-empty">
              <span style={{fontSize: '2rem'}}>📝</span>
              <h3>Click Edit to update your details</h3>
              <p>Keep your profile up to date for better career matches.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section-title">Personal</div>
              <div className="form-row">
                <div className="form-field">
                  <label>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <label>Location</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore, India" />
              </div>

              <div className="form-section-title">Education</div>
              <div className="form-row">
                <div className="form-field">
                  <label>Highest Education</label>
                  <input name="education" value={form.education} onChange={handleChange} placeholder="e.g. Master's" />
                </div>
                <div className="form-field">
                  <label>Degree</label>
                  <input name="degree" value={form.degree} onChange={handleChange} placeholder="e.g. MCA" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>College / University</label>
                  <input name="college" value={form.college} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label>Graduation Year</label>
                  <input type="number" name="graduationYear" value={form.graduationYear} onChange={handleChange} />
                </div>
              </div>

              <div className="form-section-title">Career</div>
              <div className="form-row">
                <div className="form-field">
                  <label>Career Goal</label>
                  <input name="careerGoal" value={form.careerGoal} onChange={handleChange} placeholder="e.g. Backend Engineer" />
                </div>
                <div className="form-field">
                  <label>Years of Experience</label>
                  <input type="number" step="0.5" min="0" name="experienceYears" value={form.experienceYears} onChange={handleChange} />
                </div>
              </div>
              
              <div className="form-field">
                <label>Interests</label>
                <textarea name="interests" rows="2" value={form.interests} onChange={handleChange} placeholder="Industries, problem spaces..." />
              </div>

              <div className="form-section-title">About</div>
              <div className="form-field">
                <label>Bio</label>
                <textarea name="bio" rows="4" value={form.bio} onChange={handleChange} placeholder="A short summary of where you've been..." />
              </div>

              {error && <div className="form-error">⚠️ {error}</div>}
              {saved && <div className="form-success">✅ Profile updated successfully!</div>}

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => { setEditMode(false); setSaved(false) }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
