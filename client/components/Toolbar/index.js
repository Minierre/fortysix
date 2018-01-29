import React from 'react'
import { Button } from 'react-bootstrap'
import './style.css'

const Toolbar = ({ startJob, abortJob, jobRunning, nodesInRoom }) => {
  return (
    <div className="toolbar-wrapper">
      <div className="button-group">
        <Button
          bsStyle="primary"
          onClick={startJob}
          disabled={jobRunning || !nodesInRoom}
        >Run Job</Button>
        <Button
          bsStyle="danger"
          onClick={abortJob}
        >Reset</Button>
      </div>
    </div>
  )
}

export default Toolbar
