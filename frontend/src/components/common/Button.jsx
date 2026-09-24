export default function Button({
  children,
  variant = 'primary',
  block = false,
  type = 'button',
  disabled = false,
  onClick,
  ...rest
}) {
  const classes = [
    'btn',
    variant === 'primary' ? 'btn-primary' : 'btn-ghost',
    block ? 'btn-block' : '',
  ].join(' ').trim()

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
