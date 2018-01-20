import React, { Component } from 'react'
import {
  Button,
  Tabs,
  Tab
} from 'react-bootstrap'

import {
  StatusBulbs,
  RuntimeLabel,
  ConsoleOutput,
  HistoryTable
} from '../components'

const TRAVELLING_SALESMAN = 'TRAVELLING_SALESMAN'
const START_TRAVELLING_SALESMAN = 'START_TRAVELLING_SALESMAN'
const UPDATE_TRAVELLING_SALESMAN = 'UPDATE_TRAVELLING_SALESMAN'
const GET_ROOM_TRAVELLING_SALESMAN = 'GET_ROOM_TRAVELLING_SALESMAN'
const REQUEST_ROOM = 'REQUEST_ROOM'

class TravellingSalesman extends Component {

  constructor() {
    super()
    this.state = {
      room: {}
    }
  }
  componentDidMount() {
    this.props.socket.on(UPDATE_TRAVELLING_SALESMAN, (room) => {
      this.setState({ room })
    })

    this.props.socket.on(GET_ROOM_TRAVELLING_SALESMAN, (room) => {
      this.setState({ room })
    })

    this.props.socket.emit(REQUEST_ROOM, TRAVELLING_SALESMAN)
  }

  onClick(evt) {
    this.props.socket.emit(START_TRAVELLING_SALESMAN, {
      a: { b: 1, c: 3, d: 4, e: 4 },
      b: { c: 2, d: 2, e: 5, a: 3 },
      c: { d: 4, e: 1, a: 7, b: 2 },
      d: { e: 5, a: 6, b: 1, c: 1 },
      e: { a: 3, b: 2, c: 3, d: 1 }
    })
  }

  render() {
    return (
      <div>
        <div className="algo-name-header-wrapper">
          <h2>Travelling Salesman Demo</h2>
          <p>
            For each task node for this algorithim finds a subset of the permutations neccesary to determine the shortest tour and send the results back to the root node.
          </p>
        </div>
        <div className="toolbar-wrapper">
          <Button
            bsStyle="primary"
            onClick={this.onClick.bind(this)}
          >Run Job</Button>
        </div>
        <StatusBulbs nodes={this.state.room.nodes} />
        <RuntimeLabel />
        <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
          <Tab style={{ marginTop: '0.5em' }} eventKey={1} title="History">
            <HistoryTable />
          </Tab>
          <Tab style={{ marginTop: '0.5em' }} eventKey={2} title="Output">
            <ConsoleOutput />
          </Tab>
        </Tabs>
      </div >
    )
  }
}

export default TravellingSalesman

