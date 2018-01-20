import React from 'react'
import times from 'lodash/times'
import './style.css'
import map from 'lodash/map'

const StatusBulbs = ({ nodes }) => {
  return (
    <div id="status-bulbs-wrapper">
      {
        nodes && map(nodes, (node, id) => {
          return node.error ?
            <div key={id} className="status-bulb-error" />
            :
            <div key={id} className="status-bulb" />
        })
      }
    </div>
  )
}

export default StatusBulbs
