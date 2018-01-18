import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

const Button = ({ text }) => {
  return (
      <Link
        className="nc-button"
        to="/login"
      >Login</Link>
  )
}

export default Button;
