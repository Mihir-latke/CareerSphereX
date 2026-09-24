import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Resume.css'

export default function Resume() {
  const { user } = useAuth()
  const printRef = useRef()
  const [data, setData] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'jane@example.com',
    phone: '+1 234 567 8900',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/janedoe',
    summary: 'A passionate software engineer with experience in building scalable web applications and a strong focus on backend architecture.',
    experience: [
      { id: 1, role: 'Backend Developer', company: 'Tech Corp', duration: '2022 - Present', desc: 'Developed microservices in Spring Boot, improving API response times by 30%. Led a team of 3 junior devs.' },
      { id: 2, role: 'Software Intern', company: 'Startup Inc', duration: '2021 - 2022', desc: 'Built internal dashboard using React and Node.js. Automated testing pipelines.' }
    ],
    education: [
      { id: 1, degree: 'Master of Computer Applications', school: 'Tech University', year: '2022' }
    ],
    skills: 'Java, Spring Boot, React, SQL, AWS, Docker'
  })

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value })
  
  const handleExpChange = (id, field, val) => {
    setData(d => ({ ...d, experience: d.experience.map(x => x.id === id ? { ...x, [field]: val } : x) }))
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="resume-page">
      <div className="resume-header no-print">
        <span className="eyebrow-label">Your Credentials</span>
        <h1 className="resume-title">Resume Builder</h1>
        <p className="resume-sub">Edit your details on the left, preview on the right, and print to PDF.</p>
      </div>

      <div className="resume-layout">
        {/* Editor */}
        <div className="resume-editor no-print">
          <div className="editor-section">
            <h3>Personal Info</h3>
            <div className="form-field"><label>Full Name</label><input name="name" value={data.name} onChange={handleChange} /></div>
            <div className="form-row">
              <div className="form-field"><label>Email</label><input name="email" value={data.email} onChange={handleChange} /></div>
              <div className="form-field"><label>Phone</label><input name="phone" value={data.phone} onChange={handleChange} /></div>
            </div>
            <div className="form-row">
              <div className="form-field"><label>Location</label><input name="location" value={data.location} onChange={handleChange} /></div>
              <div className="form-field"><label>LinkedIn</label><input name="linkedin" value={data.linkedin} onChange={handleChange} /></div>
            </div>
            <div className="form-field"><label>Professional Summary</label><textarea name="summary" rows="3" value={data.summary} onChange={handleChange} /></div>
          </div>
          
          <div className="editor-section">
            <h3>Skills</h3>
            <div className="form-field"><textarea name="skills" rows="2" value={data.skills} onChange={handleChange} placeholder="Comma separated skills" /></div>
          </div>

          <div className="editor-section">
            <h3>Experience</h3>
            {data.experience.map(exp => (
              <div key={exp.id} className="exp-editor-card">
                <div className="form-row">
                  <div className="form-field"><label>Role</label><input value={exp.role} onChange={e => handleExpChange(exp.id, 'role', e.target.value)} /></div>
                  <div className="form-field"><label>Company</label><input value={exp.company} onChange={e => handleExpChange(exp.id, 'company', e.target.value)} /></div>
                </div>
                <div className="form-field"><label>Duration</label><input value={exp.duration} onChange={e => handleExpChange(exp.id, 'duration', e.target.value)} /></div>
                <div className="form-field"><label>Description</label><textarea rows="2" value={exp.desc} onChange={e => handleExpChange(exp.id, 'desc', e.target.value)} /></div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-block" onClick={handlePrint}>Download as PDF</button>
        </div>

        {/* Live Preview (A4 Page) */}
        <div className="resume-preview-container">
          <div className="resume-document" ref={printRef}>
            <div className="doc-header">
              <h1 className="doc-name">{data.name}</h1>
              <div className="doc-contact">
                {data.email} • {data.phone} • {data.location} • {data.linkedin}
              </div>
            </div>
            
            <div className="doc-section">
              <h2 className="doc-section-title">Summary</h2>
              <p className="doc-text">{data.summary}</p>
            </div>

            <div className="doc-section">
              <h2 className="doc-section-title">Experience</h2>
              <div className="doc-items">
                {data.experience.map(exp => (
                  <div key={exp.id} className="doc-item">
                    <div className="doc-item-header">
                      <strong>{exp.role}</strong>
                      <span className="doc-date">{exp.duration}</span>
                    </div>
                    <div className="doc-item-sub">{exp.company}</div>
                    <p className="doc-text">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="doc-section">
              <h2 className="doc-section-title">Education</h2>
              <div className="doc-items">
                {data.education.map(edu => (
                  <div key={edu.id} className="doc-item">
                    <div className="doc-item-header">
                      <strong>{edu.degree}</strong>
                      <span className="doc-date">{edu.year}</span>
                    </div>
                    <div className="doc-item-sub">{edu.school}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="doc-section">
              <h2 className="doc-section-title">Skills</h2>
              <p className="doc-text">{data.skills}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
