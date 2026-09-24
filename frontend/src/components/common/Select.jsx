export default function Select({ label, id, children, ...rest }) {
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <select id={id} className="field-input" {...rest}>
        {children}
      </select>
    </div>
  )
}
