import React from 'react'
import times from 'lodash/times'
import './style.css'

const StatusBulbs = ({ count }) => {

  const statusBulbs = []

  for (let i = 0; i < count; ++i) {
    statusBulbs.push(<div key={i} className="status-bulb" />)
  }

  return (
    <div id="status-bulbs-wrapper">
      {statusBulbs}
    </div>
  )
}

export default StatusBulbs
