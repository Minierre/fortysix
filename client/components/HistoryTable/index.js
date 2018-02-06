import React, { Component } from 'react'
import {
  BootstrapTable,
  TableHeaderColumn
} from 'react-bootstrap-table'
import {
  Button,
  Modal
} from 'react-bootstrap'
import moment from 'moment'

import './style.css'

const TableModal = ({ fitnessFunc, toggleModal }) => (
  <Modal.Dialog>
    <Modal.Header>
      <Modal.Title>Fitness Function</Modal.Title>
    </Modal.Header>
    <Modal.Body>{fitnessFunc}</Modal.Body>
    <Modal.Footer>
      <Button bsStyle="primary" onClick={toggleModal}>Close</Button>
    </Modal.Footer>
  </Modal.Dialog>
)


class HistoryTable extends Component {
  constructor() {
    super()
    this.state = {
      showModal: false,
      fitnessFunc: ''
    }

    this.actionFormatter = this.actionFormatter.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  actionFormatter(cell, row) {
    return (
      <Button
        bsStyle="info"
        onClick={() => this.toggleModal(row.fitnessFunc)}
      >
        More
      </Button>
    )
  }

  toggleModal(fitnessFunc = '') {
    this.setState({ showModal: !this.state.showModal, fitnessFunc })
  }

  render() {
    const { data } = this.props

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

        {this.state.showModal ?
          <TableModal fitnessFunc={this.state.fitnessFunc} toggleModal={this.toggleModal} />
          :
          ''
        }

        <BootstrapTable
          data={newData}
          selectRow={selectRowProp}
          striped
          hover
          selectable
        >
          <TableHeaderColumn width="150" dataField="id" isKey hidden export>ID</TableHeaderColumn>
          <TableHeaderColumn width="150" dataField="nodes"># of Nodes</TableHeaderColumn>
          <TableHeaderColumn width="225" dataField="date">Date Run</TableHeaderColumn>
          <TableHeaderColumn width="150" dataField="execTime">Execution Time (seconds)</TableHeaderColumn>
          <TableHeaderColumn tdStyle={{ whiteSpace: 'normal' }} thStyle={{ whiteSpace: 'normal' }} width="150" dataField="result">Result</TableHeaderColumn>
          <TableHeaderColumn width="150" dataField="maxGen" export>Max Gen</TableHeaderColumn>
          <TableHeaderColumn width="150" dataField="populationSize" export>Population Size</TableHeaderColumn>
          <TableHeaderColumn width="150" dataField="fitnessGoal" export>Fitness Goal</TableHeaderColumn>
          <TableHeaderColumn width="150" dataField="chromosomeLength" export>Chromosome Length</TableHeaderColumn>
          <TableHeaderColumn width="150" dataField="elitism" export>Elitism</TableHeaderColumn>
          <TableHeaderColumn width="150" dataField="reproductiveCoefficient" export>Reproductive Coefficient</TableHeaderColumn>
          <TableHeaderColumn
            width="145"
            dataField="fitnessFunc"
            export
            dataFormat={this.actionFormatter}
          >Fitness Function
          </TableHeaderColumn>
          <TableHeaderColumn width="500" dataField="mutations" export>Mutation Functions</TableHeaderColumn>
          <TableHeaderColumn width="150" dataField="selection" export>Selection Function</TableHeaderColumn>
          <TableHeaderColumn width="225" dataField="genePool" export>Gene Pool</TableHeaderColumn>
          <TableHeaderColumn width="150" dataField="admins" hidden export>Admins</TableHeaderColumn>
          <TableHeaderColumn width="150" dataField="totalFitness" hidden export>Total Fitness</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

export default HistoryTable
