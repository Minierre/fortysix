import React from 'react'
import {
  LastExecutionInfo,
  HistoryTable,
} from '../../components'

const History = ({ history }) => {
  // this sorts the table as a side effect
  const mostRecent = history.length && history.sort((a, b) => new Date(b.endTime) - new Date(a.endTime))[0]
  const runTime = (new Date(mostRecent.endTime) - new Date(mostRecent.startTime)) / 1000
  return (
    <div>
      <LastExecutionInfo result={mostRecent.result} runTime={runTime} />
      <HistoryTable data={history} />
    </div>
  )
}

export default History
