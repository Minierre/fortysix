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
  onSelect,
  options
 }) => (
    <FormGroup
      controlId={controlId}
    >
      <ControlLabel>Selection Algorithm</ControlLabel>
      <FormControl
        componentClass="select"
        placeholder={placeholder}
        onSelect={onSelect}
        value
      >
        {options.map((option, idx) =>
          <option key={option.id} value={idx}>{option.name}</option>
        )}
      </FormControl>
      <FormControl.Feedback />
    </FormGroup>
  )

export default Select
