import React from 'react'
import times from 'lodash/times'
import './style.css'
import map from 'lodash/map'
import ReactLoading from 'react-loading';

const StatusBulbs = ({ nodes }) => {
  return (
    <div id="status-bulbs-wrapper">
      {
        nodes && map(nodes, (node, id) => {
          if (node.error) return <div key={id} className="status-bulb-error" />
          if (node.running) return (
            <ReactLoading
              height={30}
              width={30}
              key={id}
              type="spin"
              color="#444"
            />
          )
          return <div key={id} className="status-bulb" />
        })
      }
    </div>
  )
}

export default StatusBulbs
