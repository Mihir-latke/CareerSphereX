import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Roadmap.css'

const ROADMAPS = {
  'Backend Developer': [
    { id: 1, title: 'Java Basics', desc: 'Syntax, OOP, Collections Framework, Exceptions', hours: 40 },
    { id: 2, title: 'Database & SQL', desc: 'Relational DB concepts, Joins, Grouping, Indexing', hours: 30 },
    { id: 3, title: 'Spring Boot', desc: 'Dependency Injection, REST APIs, JPA/Hibernate', hours: 50 },
    { id: 4, title: 'System Design', desc: 'Caching, Queues, Microservices architecture', hours: 40 },
    { id: 5, title: 'Deployment', desc: 'Docker, CI/CD pipelines, AWS/GCP basics', hours: 25 },
  ],
  'Frontend Developer': [
    { id: 11, title: 'HTML/CSS Mastery', desc: 'Semantics, Flexbox, Grid, Responsive Design', hours: 30 },
    { id: 12, title: 'JavaScript Deep Dive', desc: 'ES6+, Closures, Promises, Async/Await', hours: 40 },
    { id: 13, title: 'React.js', desc: 'Hooks, State Management, Context, Routing', hours: 50 },
    { id: 14, title: 'Performance', desc: 'Web Vitals, Code Splitting, Memoization', hours: 25 },
    { id: 15, title: 'Testing', desc: 'Jest, React Testing Library, Cypress E2E', hours: 20 },
  ]
}

export default function Roadmap() {
  const { user } = useAuth()
  const [targetCareer, setTargetCareer] = useState('Backend Developer')
  const [progress, setProgress] = useState({}) // { [itemId]: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED' }

  const items = ROADMAPS[targetCareer] || []

  // Load saved progress from localStorage (mocking backend persistence)
  useEffect(() => {
    if (!user) return
    const saved = localStorage.getItem(`csx_roadmap_${user.userId}_${targetCareer}`)
    if (saved) {
      setProgress(JSON.parse(saved))
    } else {
      setProgress({})
    }
  }, [user, targetCareer])

  // Save progress
  useEffect(() => {
    if (!user) return
    localStorage.setItem(`csx_roadmap_${user.userId}_${targetCareer}`, JSON.stringify(progress))
  }, [progress, user, targetCareer])

  const handleStatusChange = (id, status) => {
    setProgress(p => ({ ...p, [id]: status }))
  }

  const completedCount = items.filter(i => progress[i.id] === 'COMPLETED').length
  const pct = Math.round((completedCount / items.length) * 100) || 0

  return (
    <div className="roadmap-page">
      <div className="roadmap-header">
        <div className="roadmap-title-row">
          <div>
            <span className="eyebrow-label">Chart the Route</span>
            <h1 className="roadmap-title">Learning Roadmap</h1>
          </div>
          
          <div className="roadmap-selector">
            <label>Target Career:</label>
            <select value={targetCareer} onChange={e => setTargetCareer(e.target.value)} className="input">
              {Object.keys(ROADMAPS).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="roadmap-progress-card card">
          <div className="progress-info">
            <span className="progress-label">Overall Progress</span>
            <span className="progress-value">{pct}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="progress-text">
            You've completed {completedCount} of {items.length} milestones for {targetCareer}.
          </p>
        </div>
      </div>

      <div className="roadmap-timeline">
        {items.map((item, index) => {
          const status = progress[item.id] || 'NOT_STARTED'
          
          return (
            <div key={item.id} className={`roadmap-node status-${status.toLowerCase()}`}>
              <div className="node-line">
                <div className="node-dot">{status === 'COMPLETED' ? '✓' : index + 1}</div>
              </div>
              
              <div className="node-content card">
                <div className="node-content-header">
                  <h3>{item.title}</h3>
                  <span className="node-hours">⏱️ ~{item.hours}h</span>
                </div>
                <p>{item.desc}</p>
                
                <div className="node-actions">
                  <select 
                    className="input status-select" 
                    value={status} 
                    onChange={e => handleStatusChange(item.id, e.target.value)}
                  >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
