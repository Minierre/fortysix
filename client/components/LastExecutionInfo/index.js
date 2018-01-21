import React from 'react'
import './style.css'

const LastExecutionInfo = ({ result, runTime }) => (
  <div id="last-execution-info-wrapper">
    <div className="last-result-label-wrapper">
      <h4><em>Last result: {result}</em></h4>
    </div>
    <div className="last-runtime-label-wrapper">
      <h4><em>Last execution time: {runTime} seconds</em></h4>
    </div>
  </div>
)

export default LastExecutionInfo
