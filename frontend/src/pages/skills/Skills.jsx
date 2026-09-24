import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as skillService from '../../services/skillService'
import Button from '../../components/common/Button'
import Select from '../../components/common/Select'
import Input from '../../components/common/Input'
import './Skills.css'

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']

export default function Skills() {
  const { token } = useAuth()

  const [catalog, setCatalog] = useState([])
  const [mySkills, setMySkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ skillId: '', skillLevel: 'BEGINNER', yearsExperience: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [allSkills, myList] = await Promise.all([
          skillService.getAllSkills(token),
          skillService.getMySkills(token),
        ])
        if (!cancelled) {
          setCatalog(allSkills || [])
          setMySkills(myList || [])
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load skills.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [token])

  const availableToAdd = catalog.filter(
    (s) => !mySkills.some((ms) => ms.skillId === s.skillId)
  )

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.skillId) return
    setSubmitting(true)
    setError('')
    try {
      const created = await skillService.addMySkill(token, {
        skillId: Number(form.skillId),
        skillLevel: form.skillLevel,
        yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : 0,
      })
      setMySkills((prev) => [...prev, created])
      setForm({ skillId: '', skillLevel: 'BEGINNER', yearsExperience: '' })
    } catch (err) {
      setError(err.message || 'Could not add that skill.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemove = async (userSkillId) => {
    const prev = mySkills
    setMySkills((cur) => cur.filter((s) => s.userSkillId !== userSkillId))
    try {
      await skillService.removeMySkill(token, userSkillId)
    } catch (err) {
      setMySkills(prev) // revert on failure
      setError(err.message || 'Could not remove that skill.')
    }
  }

  return (
    <div>
      <div className="skills-page-head">
        <div>
          <span className="eyebrow">Your route</span>
          <h1 style={{ margin: '4px 0 0' }}>Skills</h1>
          <p style={{ marginTop: 4 }}>What you already know — the starting point of every recommendation.</p>
        </div>
      </div>

      {error && (
        <p className="field-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</p>
      )}

      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="dash-card-title" style={{ marginBottom: 'var(--space-4)' }}>Add a skill</div>
        <form className="skills-add-form" onSubmit={handleAdd}>
          <Select
            id="skillId"
            label="Skill"
            value={form.skillId}
            onChange={(e) => setForm((f) => ({ ...f, skillId: e.target.value }))}
            disabled={loading || availableToAdd.length === 0}
          >
            <option value="">
              {availableToAdd.length === 0 ? "You've added every catalog skill" : 'Choose a skill…'}
            </option>
            {availableToAdd.map((s) => (
              <option key={s.skillId} value={s.skillId}>{s.skillName} — {s.category}</option>
            ))}
          </Select>

          <Select
            id="skillLevel"
            label="Level"
            value={form.skillLevel}
            onChange={(e) => setForm((f) => ({ ...f, skillLevel: e.target.value }))}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l.charAt(0) + l.slice(1).toLowerCase()}</option>
            ))}
          </Select>

          <Input
            id="yearsExperience"
            label="Years"
            type="number"
            min="0"
            step="0.5"
            placeholder="0"
            value={form.yearsExperience}
            onChange={(e) => setForm((f) => ({ ...f, yearsExperience: e.target.value }))}
          />

          <Button type="submit" disabled={submitting || !form.skillId}>
            {submitting ? 'Adding…' : 'Add'}
          </Button>
        </form>
      </div>

      <div className="dash-card-title">Your skills{mySkills.length > 0 ? ` (${mySkills.length})` : ''}</div>

      {loading ? (
        <p>Loading your skills…</p>
      ) : mySkills.length === 0 ? (
        <div className="card skills-empty">
          <p style={{ margin: 0 }}>No skills charted yet — add your first one above.</p>
        </div>
      ) : (
        <div className="skills-list">
          {mySkills.map((s) => (
            <div className="card skill-row" key={s.userSkillId}>
              <div className="skill-row-main">
                <span className={`skill-level-pill ${s.skillLevel}`}>{s.skillLevel}</span>
                <div>
                  <div className="skill-row-name">{s.skillName}</div>
                  <div className="skill-row-category">
                    {s.category}{s.yearsExperience ? ` · ${s.yearsExperience} yrs` : ''}
                  </div>
                </div>
              </div>
              <div className="skill-row-actions">
                <button
                  className="icon-btn"
                  onClick={() => handleRemove(s.userSkillId)}
                  title="Remove skill"
                  aria-label={`Remove ${s.skillName}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
