import React from 'react'
import './style.css'

const LastExecutionInfo = ({ result, runtime }) => (
  <div id="last-execution-info-wrapper">
    <div className="last-result-label-wrapper">
      <h4><em>Result: {result}</em></h4>
    </div>
    <div className="last-runtime-label-wrapper">
      <h4><em>Execution time: {runtime}</em></h4>
    </div>
  </div>
)

export default LastExecutionInfo
