import React from 'react'
import {
  BootstrapTable,
  TableHeaderColumn
} from 'react-bootstrap-table'
import {
  Button
} from 'react-bootstrap'
import moment from 'moment'
import './style.css'

const actionFormatter = (cell, row) => (
  <Button
    bsStyle="info"
    onClick={() => console.log('open modal')}
  >
    More
  </Button>
)


const HistoryTable = ({ data }) => {
  const newData = data && data.reduce((acc, row) => {
    const date = new Date(row.startTime)
    return acc.concat({
      ...row,
      date: moment(date).format('MMMM Do YYYY, h:mm:ss a'),
      execTime: (new Date(row.endTime) - new Date(row.startTime)) / 1000
    })
  }, [])

  const selectRowProp = {
    mode: 'checkbox',
    bgColor: 'pink'
  }

  return (
    <div className="history-table">
      <BootstrapTable
        data={newData}
        selectRow={selectRowProp}
        exportCSV
        striped
        hover
        selectable
      >
        <TableHeaderColumn dataField="id" isKey hidden export>ID</TableHeaderColumn>
        <TableHeaderColumn dataField="nodes"># of Nodes</TableHeaderColumn>
        <TableHeaderColumn dataField="date">Date Run</TableHeaderColumn>
        <TableHeaderColumn dataField="execTime">Execution Time (seconds)</TableHeaderColumn>
        <TableHeaderColumn dataField="result">Result</TableHeaderColumn>
        <TableHeaderColumn
          dataField="action"
          export={false}
          dataFormat={actionFormatter}
        >
          Action
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  )
}

export default HistoryTable
