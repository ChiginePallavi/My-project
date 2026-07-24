import React from 'react'
import './Button.css'

function Button({ label, onClick, type = 'button', variant = 'primary', disabled = false }) {
  return (
    <button className={`btn btn-${variant}`} type={type} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

export default Button
