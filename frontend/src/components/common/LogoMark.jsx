export default function LogoMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14.5" stroke="var(--color-route)" strokeWidth="1" />
      <path d="M16 4 L16 8 M16 24 L16 28 M4 16 L8 16 M24 16 L28 16" stroke="var(--color-route)" strokeWidth="1" />
      <path d="M16 9 L19.5 16 L16 23 L12.5 16 Z" fill="var(--color-route)" />
      <circle cx="16" cy="16" r="2" fill="var(--color-chart)" stroke="var(--color-waypoint)" strokeWidth="1.2" />
    </svg>
  )
}
