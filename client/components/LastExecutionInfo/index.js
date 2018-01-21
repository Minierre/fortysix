import React from 'react'
import './style.css'

const LastExecutionInfo = ({ result, runTime }) => (
  <div id="last-execution-info-wrapper">
    <div className="last-result-label-wrapper">
      <h4><strong>Last result:</strong> <em>{result}</em></h4>
    </div>
    <div className="last-runtime-label-wrapper">
      <h4><strong>Last execution time:</strong> <em>{runTime} seconds</em></h4>
    </div>
  </div>
)

export default LastExecutionInfo
