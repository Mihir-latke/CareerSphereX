import LogoMark from '../common/LogoMark'
import './AuthLayout.css'

const WAYPOINTS = [
  { label: 'Skills charted', done: true },
  { label: 'Gaps identified', done: true },
  { label: 'Roadmap plotted', done: false },
  { label: 'Role reached', done: false },
]

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="auth-panel-inner">
          <div className="auth-brand">
            <LogoMark size={26} />
            <span>CareerSphereX</span>
          </div>

          <h1 className="auth-panel-title">
            Every career has a route. <em>We help you chart yours.</em>
          </h1>

          <div className="auth-route">
            {WAYPOINTS.map((wp, i) => (
              <div className="auth-route-step" key={wp.label}>
                <div className={`waypoint-dot ${wp.done ? 'is-complete' : 'is-pending'}`} />
                <span>{wp.label}</span>
                {i < WAYPOINTS.length - 1 && <div className="auth-route-line" />}
              </div>
            ))}
          </div>

          <p className="auth-panel-caption">
            From your current skills to your target role — plotted, not guessed.
          </p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-card">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="auth-form-title">{title}</h2>
          {subtitle && <p className="auth-form-subtitle">{subtitle}</p>}
          {children}
          {footer && <div className="auth-form-footer">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
