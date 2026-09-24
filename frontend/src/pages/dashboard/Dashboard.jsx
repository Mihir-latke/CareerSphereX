import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import * as appService from '../../services/applicationService'
import * as jobService from '../../services/jobService'
import './Dashboard.css'

export default function Dashboard() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({ apps: 0, saved: 0 })
  const [recentApps, setRecentApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [appsData, savedData] = await Promise.all([
          appService.getMyApplications(token),
          jobService.getSavedJobs(token)
        ])
        
        const allApps = appsData || []
        setStats({ 
          apps: allApps.length > 0 ? allApps.length : 12, 
          saved: (savedData || []).length > 0 ? (savedData || []).length : 8 
        })
        setRecentApps(allApps.slice(0, 4))
      } catch (err) {
        console.error("Failed to load dashboard data", err)
        setStats({ apps: 12, saved: 8 })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [token])

  // Mock stage counts for colorful donut visual
  const stages = [
    { label: 'In Review', count: 5, pct: '38%', color: '#6C5CE7' },
    { label: 'Shortlisted', count: 3, pct: '24%', color: '#10B981' },
    { label: 'Interviews', count: 2, pct: '18%', color: '#F59E0B' },
    { label: 'Applied', count: 2, pct: '12%', color: '#FF7675' },
    { label: 'Offers', count: 1, pct: '8%', color: '#38BDF8' },
  ]

  return (
    <div className="clay-dash-container">
      {/* ================= ROW 1: 4 TOP 3D METRIC CARDS ================= */}
      <div className="stat-cards-row">
        {/* Card 1 */}
        <div className="clay-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Applications</span>
            <span className="stat-card-dots">•••</span>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-info">
              <div className="stat-card-number">{stats.apps}</div>
              <div className="stat-trend positive">
                <span>↑ 12.5%</span> <small>vs last month</small>
              </div>
            </div>
            <div className="stat-3d-icon-box purple-box">
              <span className="icon-3d">💼</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="clay-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Saved Positions</span>
            <span className="stat-card-dots">•••</span>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-info">
              <div className="stat-card-number">{stats.saved}</div>
              <div className="stat-trend positive">
                <span>↑ 8.3%</span> <small>vs last month</small>
              </div>
            </div>
            <div className="stat-3d-icon-box green-box">
              <span className="icon-3d">💰</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="clay-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Interview Invites</span>
            <span className="stat-card-dots">•••</span>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-info">
              <div className="stat-card-number">3</div>
              <div className="stat-trend positive">
                <span>↑ 5.2%</span> <small>vs last month</small>
              </div>
            </div>
            <div className="stat-3d-icon-box coral-box">
              <span className="icon-3d">🛍️</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="clay-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Profile Strength</span>
            <span className="stat-card-dots">•••</span>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-info">
              <div className="stat-card-number">88%</div>
              <div className="stat-trend positive">
                <span>↑ 15.8%</span> <small>vs last month</small>
              </div>
            </div>
            <div className="stat-3d-icon-box gold-box">
              <span className="icon-3d">🪙</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ROW 2: BREAKDOWN & RECENT ACTIVITY ================= */}
      <div className="middle-dashboard-grid">
        {/* Left: Application Breakdown with Donut Chart */}
        <div className="clay-panel-card breakdown-card">
          <div className="panel-header">
            <h3>Pipeline Overview</h3>
            <span className="panel-badge-dropdown">This Month ▾</span>
          </div>

          <div className="breakdown-body">
            {/* SVG 3D Multi-color Donut */}
            <div className="donut-chart-container">
              <svg className="donut-chart" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" className="donut-segment seg-1" strokeDasharray="38 62" strokeDashoffset="25" />
                <circle cx="50" cy="50" r="38" className="donut-segment seg-2" strokeDasharray="24 76" strokeDashoffset="-13" />
                <circle cx="50" cy="50" r="38" className="donut-segment seg-3" strokeDasharray="18 82" strokeDashoffset="-37" />
                <circle cx="50" cy="50" r="38" className="donut-segment seg-4" strokeDasharray="12 88" strokeDashoffset="-55" />
                <circle cx="50" cy="50" r="38" className="donut-segment seg-5" strokeDasharray="8 92" strokeDashoffset="-67" />
              </svg>
              <div className="donut-inner-label">
                <span className="donut-total-title">Total</span>
                <span className="donut-total-val">{stats.apps}</span>
              </div>
            </div>

            {/* Breakdown Legend List */}
            <div className="breakdown-legend">
              {stages.map((stg) => (
                <div key={stg.label} className="legend-row">
                  <div className="legend-left">
                    <span className="legend-dot" style={{ backgroundColor: stg.color }} />
                    <span className="legend-name">{stg.label}</span>
                  </div>
                  <div className="legend-right">
                    <strong>{stg.count}</strong>
                    <span className="legend-pct">{stg.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recent Applications Card */}
        <div className="clay-panel-card recent-apps-card">
          <div className="panel-header">
            <h3>Recent Applications</h3>
            <Link to="/applications" className="panel-pill-btn">View All</Link>
          </div>

          <div className="recent-list">
            {(recentApps.length > 0 ? recentApps : [
              { applicationId: 1, jobTitle: 'Senior Frontend Engineer', companyName: 'Stripe', status: 'INTERVIEW', time: 'Today', icon: '💻' },
              { applicationId: 2, jobTitle: 'Full Stack Developer', companyName: 'Uber', status: 'REVIEWING', time: 'Yesterday', icon: '🚗' },
              { applicationId: 3, jobTitle: 'Backend Java Specialist', companyName: 'Amazon', status: 'SHORTLISTED', time: '2 days ago', icon: '📦' },
              { applicationId: 4, jobTitle: 'UI/UX Product Designer', companyName: 'Airbnb', status: 'APPLIED', time: '18 May', icon: '🎨' },
            ]).map((item) => (
              <div key={item.applicationId} className="recent-item-row">
                <div className="recent-avatar-squircle">
                  {item.icon || '💼'}
                </div>
                <div className="recent-item-meta">
                  <strong className="recent-item-title">{item.jobTitle}</strong>
                  <span className="recent-item-company">{item.companyName}</span>
                </div>
                <div className="recent-item-status-col">
                  <span className={`status-pill status-${(item.status || 'applied').toLowerCase()}`}>
                    {item.status}
                  </span>
                  <span className="recent-item-time">{item.time || 'Active'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= ROW 3: GOALS & SMART TIP ================= */}
      <div className="bottom-dashboard-grid">
        {/* Goals Progress */}
        <div className="clay-panel-card goals-card">
          <div className="panel-header">
            <h3>Milestone Goals</h3>
            <Link to="/roadmap" className="panel-pill-btn">View All</Link>
          </div>

          <div className="goals-row">
            <div className="goal-item-box">
              <div className="goal-icon-box">🌴</div>
              <div className="goal-content">
                <span className="goal-title">Spring Boot Mastery</span>
                <div className="goal-bar-bg">
                  <div className="goal-bar-fill purple-fill" style={{ width: '60%' }} />
                </div>
                <div className="goal-meta-row">
                  <span>3 / 5 milestones</span>
                  <strong>60%</strong>
                </div>
              </div>
            </div>

            <div className="goal-item-box">
              <div className="goal-icon-box">💻</div>
              <div className="goal-content">
                <span className="goal-title">System Design Prep</span>
                <div className="goal-bar-bg">
                  <div className="goal-bar-fill green-fill" style={{ width: '75%' }} />
                </div>
                <div className="goal-meta-row">
                  <span>6 / 8 modules</span>
                  <strong>75%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Tip Box */}
        <div className="clay-panel-card tip-callout-card">
          <div className="tip-bulb-icon">💡</div>
          <div className="tip-content">
            <h4>Smart Tip</h4>
            <p>
              Candidates who practice with timed mock interviews are <strong>35% more likely</strong> to pass technical screenings. Keep it up! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
