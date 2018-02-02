import React from 'react'
import {
  Table
} from 'react-bootstrap'
import moment from 'moment'
import './style.css'

const HistoryTable = ({ data }) => (
  <div className="history-table">
    <Table striped responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Date Run</th>
          <th># of Nodes</th>
          <th>Execution Time (seconds)</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {data && data.map(row => {
          var date = new Date(row.startTime);
          return (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{moment(date).format('MMMM Do YYYY, h:mm:ss a')}</td>
              <td>{row.nodes}</td>
              <td>{(new Date(row.endTime) - new Date(row.startTime)) / 1000}</td>
              <td>{row.result}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  </div>

)

export default HistoryTable
