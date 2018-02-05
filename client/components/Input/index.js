import React from 'react'
import {
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap'
import './style.css'

const Input = ({
  controlId,
  label,
  value,
  placeholder,
  type,
  onChange,
  onBlur
 }) => (
    <FormGroup
      controlId={controlId}
      label={label}
      value={value}
      placeholder={placeholder}
    >
      <ControlLabel>{label}</ControlLabel>
      <FormControl
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
      />
      <FormControl.Feedback />
    </FormGroup>
  )

export default Input

