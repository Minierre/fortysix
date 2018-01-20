import React from 'react'
import {
  Table
} from 'react-bootstrap'

const HistoryTable = () => (
  <Table responsive>
    <thead>
      <tr>
        <th>#</th>
        <th>Date Run</th>
        <th># of Nodes</th>
        <th>Execution Time</th>
        <th>Iterations per node</th>
        <th>Result</th>
        <th>Sucessful</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
        <td>Table cell</td>
      </tr>
    </tbody>
  </Table>
)

export default HistoryTable
