import React from 'react'
import {
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap'

const Select = ({
  controlId,
  label,
  placeholder,
  type,
  value,
  onChange,
  options,
  onBlur
 }) => (
    <FormGroup
      controlId={controlId}
    >
      <ControlLabel>Selection Algorithm</ControlLabel>
      <FormControl
        componentClass="select"
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
      >
        {options.map((option, idx) =>
          <option key={option.id} value={option.id}>{option.name}</option>
        )}
      </FormControl>
      <FormControl.Feedback />
    </FormGroup>
  )

export default Select
