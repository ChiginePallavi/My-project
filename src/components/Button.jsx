import './Button.css'

function Button({ label, variant = 'primary', onClick }) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} type="button">
      {label}
    </button>
  )
}

export default Button
