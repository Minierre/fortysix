import React from 'react'
import {
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap'

const Input = ({
  controlId,
  label,
  value,
  placeholder,
  type,
  onChange
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
      />
      <FormControl.Feedback />
    </FormGroup>
  )

export default Input

