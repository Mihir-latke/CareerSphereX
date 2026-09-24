import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24,
    }}>
      <span className="eyebrow">Off the map</span>
      <h1 style={{ fontSize: 'var(--fs-display-l)', margin: '8px 0 12px' }}>
        This route doesn't exist.
      </h1>
      <p>The page you're looking for isn't charted. Let's get you back on course.</p>
      <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: 16 }}>
        Return to dashboard
      </Link>
    </div>
  )
}
