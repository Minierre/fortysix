import React from 'react'
import {
  StatusBulbs,
  Toolbar,
  Timer
} from '../../components'

const Status = ({
  nodes,
  chromosomesReturned,
  totalFitness,
  jobRunning,
  abortJob,
  startJob,
  start
}) => (
    <div>
      <h4><strong>Node count:</strong> <em>{(nodes) ? Object.keys(nodes).length : 0}</em></h4>
      <StatusBulbs nodes={nodes} />
      <h4><strong>Chromosomes Processed:</strong> <em>{chromosomesReturned || 0}</em></h4>
      <h4><strong>Total Fitness:</strong> <em>{totalFitness || 0}</em></h4>
      <h4><strong>Average Fitness:</strong> <em>{(totalFitness / chromosomesReturned) || 0}</em></h4>
      <Timer start={start} />
      <Toolbar
        startJob={startJob}
        abortJob={abortJob}
        jobRunning={jobRunning}
        nodesInRoom={Object.keys(nodes || {}).length > 0}
      />
    </div>
  )

export default Status
