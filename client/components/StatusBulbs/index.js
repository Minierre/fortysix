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
          if (!node.ready) return <div key={id} className="status-bulb-not-ready"/>
          if (node.running) return (
            <div key={id} className="status-bulb-running">
              <ReactLoading
                height={30}
                width={30}
                type="spin"
                color="#444"
              />
            </div>
          )
          return <div key={id} className="status-bulb" />
        })
      }
    </div>
  )
}

export default StatusBulbs
