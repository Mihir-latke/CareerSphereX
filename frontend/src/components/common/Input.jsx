export default function Input({ label, id, error, type = 'text', ...rest }) {
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} type={type} className="field-input" {...rest} />
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
