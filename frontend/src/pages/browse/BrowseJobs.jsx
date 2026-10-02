import { useState, useMemo } from 'react'
import './BrowseJobs.css'

// ─── Platform configs ────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    lightColor: '#E8F0FA',
    searchUrl: (q, loc) =>
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}&location=${encodeURIComponent(loc || 'India')}&f_TPR=r86400`,
    description: 'Professional network with millions of job listings',
  },
  {
    id: 'naukri',
    name: 'Naukri.com',
    icon: '🏢',
    color: '#FF7555',
    lightColor: '#FFF0ED',
    searchUrl: (q, loc) =>
      `https://www.naukri.com/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, '-'))}-jobs${loc ? `-in-${encodeURIComponent(loc.toLowerCase().replace(/\s+/g, '-'))}` : ''}`,
    description: 'India\'s largest job portal with 70,000+ daily new listings',
  },
  {
    id: 'internshala',
    name: 'Internshala',
    icon: '🎓',
    color: '#007BFF',
    lightColor: '#E8F4FD',
    searchUrl: (q, loc) =>
      `https://internshala.com/internships/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, '-'))}-internship${loc ? `-in-${encodeURIComponent(loc.toLowerCase().replace(/\s+/g, '-'))}` : ''}`,
    description: 'Top platform for internships and fresher jobs in India',
  },
  {
    id: 'google',
    name: 'Google Jobs',
    icon: '🔍',
    color: '#EA4335',
    lightColor: '#FDEDED',
    searchUrl: (q, loc) =>
      `https://www.google.com/search?q=${encodeURIComponent(q + ' jobs' + (loc ? ' in ' + loc : ' India'))}&ibp=htl;jobs`,
    description: 'Search millions of jobs across the web in one place',
  },
  {
    id: 'indeed',
    name: 'Indeed',
    icon: '🌐',
    color: '#2164F3',
    lightColor: '#ECF1FD',
    searchUrl: (q, loc) =>
      `https://in.indeed.com/jobs?q=${encodeURIComponent(q)}&l=${encodeURIComponent(loc || 'India')}&sort=date`,
    description: 'World\'s #1 job site with over 250M monthly visitors',
  },
  {
    id: 'glassdoor',
    name: 'Glassdoor',
    icon: '🏆',
    color: '#0CAA41',
    lightColor: '#E8FAF0',
    searchUrl: (q, loc) =>
      `https://www.glassdoor.co.in/Job/india-${encodeURIComponent(q.toLowerCase().replace(/\s+/g, '-'))}-jobs-SRCH_IL.0,5_IN115_KO6,${6 + q.length}.htm`,
    description: 'Jobs with company reviews, salaries, and interview insights',
  },
  {
    id: 'shine',
    name: 'Shine.com',
    icon: '✨',
    color: '#F5A623',
    lightColor: '#FEF6E8',
    searchUrl: (q, loc) =>
      `https://www.shine.com/job-search/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, '-'))}-jobs${loc ? `-in-${encodeURIComponent(loc.toLowerCase().replace(/\s+/g, '-'))}` : ''}`,
    description: 'Premium job portal with verified companies and salary insights',
  },
  {
    id: 'unstop',
    name: 'Unstop',
    icon: '🚀',
    color: '#6C5CE7',
    lightColor: '#F0EEFD',
    searchUrl: (q) =>
      `https://unstop.com/jobs?search=${encodeURIComponent(q)}&opportunity=jobs`,
    description: 'Competitions, hackathons, and job opportunities for students',
  },
]

// ─── Trending role suggestions ────────────────────────────────────────────────
const TRENDING_ROLES = [
  'Software Engineer', 'Data Scientist', 'Full Stack Developer',
  'React Developer', 'Java Developer', 'Product Manager',
  'UI/UX Designer', 'Machine Learning Engineer', 'DevOps Engineer',
  'Business Analyst', 'Python Developer', 'Cloud Architect',
]

const TRENDING_LOCATIONS = [
  'Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi NCR',
  'Chennai', 'Remote', 'Kolkata', 'Ahmedabad',
]

export default function BrowseJobs() {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set(['linkedin', 'naukri', 'internshala', 'google']))
  const [jobType, setJobType] = useState('')
  const [searched, setSearched] = useState(false)

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size > 1) next.delete(id) // keep at least one
      } else {
        next.add(id)
      }
      return next
    })
  }

  const activePlatforms = useMemo(
    () => PLATFORMS.filter(p => selectedPlatforms.has(p.id)),
    [selectedPlatforms]
  )

  const buildSearchQuery = (role) => {
    const q = role || search
    if (!q.trim()) return
    setSearch(q)
    setSearched(true)
  }

  const openAllPlatforms = () => {
    if (!search.trim()) { alert('Please enter a job title or keyword first!'); return }
    const q = jobType ? `${search} ${jobType}` : search
    activePlatforms.forEach(p => {
      window.open(p.searchUrl(q, location), '_blank', 'noopener,noreferrer')
    })
  }

  const openPlatform = (platform) => {
    if (!search.trim()) { alert('Please enter a job title or keyword first!'); return }
    const q = jobType ? `${search} ${jobType}` : search
    window.open(platform.searchUrl(q, location), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="browse-jobs-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="bj-hero">
        <div className="bj-hero-content">
          <div className="bj-hero-badge">🌐 Job Aggregator</div>
          <h1 className="bj-hero-title">
            Browse <span className="bj-gradient-text">Latest Vacancies</span><br />
            from All Top Platforms
          </h1>
          <p className="bj-hero-sub">
            Search once, apply everywhere — LinkedIn, Naukri, InternShala, Google Jobs, Indeed and more.
          </p>

          {/* ── Main Search Bar ── */}
          <div className="bj-search-card">
            <div className="bj-search-row">
              <div className="bj-search-field">
                <span className="bj-search-field-icon">🔍</span>
                <input
                  className="bj-search-input"
                  type="text"
                  placeholder="Job title, skill, or company…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && buildSearchQuery()}
                />
              </div>
              <div className="bj-divider-line" />
              <div className="bj-search-field">
                <span className="bj-search-field-icon">📍</span>
                <input
                  className="bj-search-input"
                  type="text"
                  placeholder="City, state or Remote…"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && buildSearchQuery()}
                />
              </div>
              <div className="bj-divider-line" />
              <select
                className="bj-type-select"
                value={jobType}
                onChange={e => setJobType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Full Time">Full-time</option>
                <option value="Part Time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
                <option value="Fresher">Fresher</option>
              </select>
              <button className="bj-search-btn" onClick={() => buildSearchQuery()}>
                Search Jobs
              </button>
            </div>
          </div>

          {/* Trending Roles */}
          <div className="bj-trending-row">
            <span className="bj-trending-label">🔥 Trending:</span>
            {TRENDING_ROLES.slice(0, 6).map(role => (
              <button key={role} className="bj-trending-pill" onClick={() => buildSearchQuery(role)}>
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="bj-stats-bar">
          <div className="bj-stat-item"><strong>8</strong> <span>Platforms</span></div>
          <div className="bj-stat-divider" />
          <div className="bj-stat-item"><strong>1M+</strong> <span>Live Jobs</span></div>
          <div className="bj-stat-divider" />
          <div className="bj-stat-item"><strong>Free</strong> <span>Always Free</span></div>
          <div className="bj-stat-divider" />
          <div className="bj-stat-item"><strong>Real-time</strong> <span>Latest Vacancies</span></div>
        </div>
      </div>

      {/* ── PLATFORM SELECTOR ──────────────────────────────────────────────── */}
      <div className="bj-section">
        <div className="bj-section-header">
          <h2>Select Platforms</h2>
          <span className="bj-section-badge">{selectedPlatforms.size} selected</span>
        </div>
        <div className="bj-platforms-grid">
          {PLATFORMS.map(platform => (
            <button
              key={platform.id}
              className={`bj-platform-chip ${selectedPlatforms.has(platform.id) ? 'selected' : ''}`}
              style={{
                '--platform-color': platform.color,
                '--platform-light': platform.lightColor,
              }}
              onClick={() => togglePlatform(platform.id)}
            >
              <span className="bj-platform-icon">{platform.icon}</span>
              <span className="bj-platform-name">{platform.name}</span>
              {selectedPlatforms.has(platform.id) && <span className="bj-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULTS / PLATFORM CARDS ────────────────────────────────────────── */}
      {searched && search.trim() && (
        <div className="bj-section">
          <div className="bj-results-header">
            <div>
              <h2>Results for "<strong>{search}</strong>"
                {location && <span className="bj-loc-tag"> in {location}</span>}
              </h2>
              <p className="bj-results-sub">
                Click any platform card to browse live jobs. New listings update every few hours.
              </p>
            </div>
            <button className="bj-open-all-btn" onClick={openAllPlatforms}>
              🚀 Open All ({activePlatforms.length}) Platforms
            </button>
          </div>

          <div className="bj-result-cards-grid">
            {activePlatforms.map(platform => (
              <div
                key={platform.id}
                className="bj-result-card"
                style={{ '--platform-color': platform.color, '--platform-light': platform.lightColor }}
              >
                <div className="bj-result-card-top">
                  <div className="bj-result-icon-box">
                    <span>{platform.icon}</span>
                  </div>
                  <div className="bj-result-meta">
                    <h3 className="bj-result-platform-name">{platform.name}</h3>
                    <p className="bj-result-desc">{platform.description}</p>
                  </div>
                </div>

                <div className="bj-result-query-preview">
                  <span className="bj-query-badge">
                    🔎 "{jobType ? `${search} ${jobType}` : search}"
                    {location && ` · 📍 ${location}`}
                  </span>
                </div>

                <div className="bj-result-card-actions">
                  <button
                    className="bj-apply-btn"
                    onClick={() => openPlatform(platform)}
                  >
                    View Jobs on {platform.name} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── POPULAR LOCATIONS ────────────────────────────────────────────────── */}
      <div className="bj-section">
        <h2>Browse by Location</h2>
        <div className="bj-location-chips">
          {TRENDING_LOCATIONS.map(loc => (
            <button
              key={loc}
              className={`bj-location-chip ${location === loc ? 'active' : ''}`}
              onClick={() => { setLocation(loc); setSearched(search.trim().length > 0) }}
            >
              📍 {loc}
            </button>
          ))}
        </div>
      </div>

      {/* ── HOT ROLES GRID ───────────────────────────────────────────────────── */}
      <div className="bj-section">
        <h2>🔥 Hot Job Roles Right Now</h2>
        <div className="bj-hot-roles-grid">
          {[
            { role: 'React Developer', icon: '⚛️', count: '12,000+', color: '#61DAFB', bg: '#E8FAFE' },
            { role: 'Data Scientist', icon: '📊', count: '8,500+', color: '#FF6B6B', bg: '#FFF0F0' },
            { role: 'Java Backend', icon: '☕', count: '15,000+', color: '#E76F00', bg: '#FFF4E6' },
            { role: 'DevOps Engineer', icon: '⚙️', count: '6,200+', color: '#4CAF50', bg: '#F1FBF1' },
            { role: 'Product Manager', icon: '🗂️', count: '4,800+', color: '#9B59B6', bg: '#F5EDFD' },
            { role: 'UI/UX Designer', icon: '🎨', count: '7,100+', color: '#E91E63', bg: '#FDE8F0' },
            { role: 'Python Developer', icon: '🐍', count: '9,300+', color: '#3776AB', bg: '#EBF3FB' },
            { role: 'ML Engineer', icon: '🤖', count: '5,400+', color: '#FF9800', bg: '#FFF3E0' },
          ].map(item => (
            <button
              key={item.role}
              className="bj-hot-role-card"
              style={{ '--role-color': item.color, '--role-bg': item.bg }}
              onClick={() => buildSearchQuery(item.role)}
            >
              <span className="bj-hot-role-icon">{item.icon}</span>
              <div className="bj-hot-role-info">
                <span className="bj-hot-role-name">{item.role}</span>
                <span className="bj-hot-role-count">{item.count} openings</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── ALL PLATFORMS DETAIL ─────────────────────────────────────────────── */}
      <div className="bj-section">
        <h2>All Job Platforms</h2>
        <div className="bj-all-platforms-list">
          {PLATFORMS.map(platform => (
            <div key={platform.id} className="bj-platform-row" style={{ '--platform-color': platform.color, '--platform-light': platform.lightColor }}>
              <div className="bj-platform-row-left">
                <div className="bj-platform-row-icon">{platform.icon}</div>
                <div>
                  <strong className="bj-platform-row-name">{platform.name}</strong>
                  <p className="bj-platform-row-desc">{platform.description}</p>
                </div>
              </div>
              <button
                className="bj-platform-row-btn"
                onClick={() => {
                  const q = search.trim() || 'Software Engineer'
                  window.open(platform.searchUrl(q, location), '_blank', 'noopener,noreferrer')
                }}
              >
                Browse Jobs →
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
