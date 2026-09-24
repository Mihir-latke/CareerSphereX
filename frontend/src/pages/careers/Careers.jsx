import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Careers.css'

const CAREERS = [
  { id: 1, name: 'Frontend Developer',  skills: ['React','JavaScript','CSS','TypeScript','HTML'], avgSalary: '6–18 LPA', demand: 'HIGH' },
  { id: 2, name: 'Backend Developer',   skills: ['Java','Spring Boot','SQL','REST API','Docker'], avgSalary: '7–20 LPA', demand: 'HIGH' },
  { id: 3, name: 'Full Stack Developer',skills: ['React','Node.js','SQL','Git','Docker'],         avgSalary: '8–22 LPA', demand: 'VERY_HIGH' },
  { id: 4, name: 'Data Scientist',      skills: ['Python','SQL','Machine Learning','Statistics','Pandas'], avgSalary: '9–25 LPA', demand: 'VERY_HIGH' },
  { id: 5, name: 'DevOps Engineer',     skills: ['Docker','Kubernetes','CI/CD','Linux','AWS'],   avgSalary: '10–28 LPA', demand: 'HIGH' },
  { id: 6, name: 'ML Engineer',         skills: ['Python','TensorFlow','Deep Learning','SQL','Git'], avgSalary: '12–30 LPA', demand: 'VERY_HIGH' },
  { id: 7, name: 'Android Developer',   skills: ['Java','Kotlin','Android','REST API','Git'],    avgSalary: '6–18 LPA', demand: 'MEDIUM' },
  { id: 8, name: 'Product Manager',     skills: ['Communication','Analytics','SQL','UX','Agile'], avgSalary: '10–25 LPA', demand: 'HIGH' },
  { id: 9, name: 'UI/UX Designer',      skills: ['Figma','CSS','UX Research','Prototyping'],     avgSalary: '5–15 LPA', demand: 'MEDIUM' },
  { id: 10, name: 'Cloud Architect',    skills: ['AWS','Azure','Docker','Kubernetes','Networking'], avgSalary: '15–40 LPA', demand: 'HIGH' },
]

export default function Careers() {
  // Using a mock skills set for now until the user adds skills in the UI
  // In a full implementation this would fetch from /api/users/me/skills
  const [userSkills] = useState(['Java', 'SQL', 'Git', 'HTML', 'CSS'])

  const matches = CAREERS.map(c => {
    const has = c.skills.filter(s => userSkills.includes(s))
    const missing = c.skills.filter(s => !userSkills.includes(s))
    const matchPct = Math.round((has.length / c.skills.length) * 100)
    return { ...c, has, missing, matchPct }
  }).sort((a, b) => b.matchPct - a.matchPct)

  return (
    <div className="careers-page">
      <div className="careers-header">
        <span className="eyebrow-label">Your Next Move</span>
        <h1 className="careers-title">Career Recommendations</h1>
        <p className="careers-sub">Personalized paths based on your current skills.</p>
      </div>

      <div className="careers-grid">
        {matches.map((career, index) => (
          <div key={career.id} className={`career-card card ${index === 0 ? 'top-match' : ''}`}>
            {index === 0 && <div className="top-match-badge">🏆 Best Match</div>}
            
            <div className="career-card-top">
              <div className="career-info">
                <h2>{career.name}</h2>
                <div className="career-meta">
                  <span className={`demand-badge demand-${career.demand.toLowerCase()}`}>
                    {career.demand.replace('_', ' ')} DEMAND
                  </span>
                  <span className="salary-info">💰 {career.avgSalary}</span>
                </div>
              </div>
              
              <div className="match-ring-wrapper">
                <svg className="match-ring" viewBox="0 0 36 36">
                  <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="ring-fill" strokeDasharray={`${career.matchPct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="ring-text">{career.matchPct}%</text>
                </svg>
              </div>
            </div>

            <div className="career-skills-section">
              <div className="skills-row">
                <span className="skills-label">You have:</span>
                <div className="skills-tags">
                  {career.has.length ? career.has.map(s => <span key={s} className="skill-tag has">{s}</span>) : <span className="text-muted">None</span>}
                </div>
              </div>
              <div className="skills-row">
                <span className="skills-label">Missing:</span>
                <div className="skills-tags">
                  {career.missing.length ? career.missing.map(s => <span key={s} className="skill-tag missing">{s}</span>) : <span className="text-success">Ready to apply!</span>}
                </div>
              </div>
            </div>

            <div className="career-actions">
              <Link to="/skills" className="btn btn-ghost btn-sm">Add Skills</Link>
              <Link to={`/jobs?search=${encodeURIComponent(career.name)}`} className="btn btn-primary btn-sm">Explore Jobs →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
