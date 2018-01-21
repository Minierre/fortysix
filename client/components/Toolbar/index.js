import React from 'react'
import { Button } from 'react-bootstrap'
import './style.css'
import Switch from 'react-toggle-switch'

const Toolbar = ({ startJob, abortJob, toggleMultiThreaded, jobRunning, multiThreaded }) => (
  <div className="toolbar-wrapper">
    <div className="button-group">
      <Button
        bsStyle="primary"
        onClick={startJob}
        disabled={jobRunning}
      >Run Job</Button>
      <Button
        bsStyle="danger"
        disabled={!jobRunning}
      >Abort</Button>
    </div>

    <div className="switches-group">
      <Switch onClick={toggleMultiThreaded} on={multiThreaded} />
      <div>Use web workers (multithreaded)</div>
    </div>
  </div>
)

export default Toolbar
