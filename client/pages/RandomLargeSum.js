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

const HUGE_SUM = 'HUGE_SUM'
const START_HUGE_SUM = 'START_HUGE_SUM'
const UPDATE_HUGE_SUM = 'UPDATE_HUGE_SUM'
const GET_ROOM_HUGE_SUM = 'GET_ROOM_HUGE_SUM'
const REQUEST_ROOM = 'REQUEST_ROOM'

class RandomLargeSum extends Component {

  constructor() {
    super()
    this.state = {
      room: {
        nodes: {}
      }
    }
  }
  componentDidMount() {
    this.props.socket.on(UPDATE_HUGE_SUM, (room) => {
      this.setState({ room })
    })

    this.props.socket.on(GET_ROOM_HUGE_SUM, (room) => {
      this.setState({ room })
    })

    this.props.socket.emit(REQUEST_ROOM, HUGE_SUM)
  }

  onClick(evt) {
    this.props.socket.emit(START_HUGE_SUM)
  }

  render() {
    return (
      <div>
        <div className="algo-name-header-wrapper">
          <h2>Accumlated Large Sum Demo</h2>
          <p>
            For each node this algorithm will randomly generate 10 million numbers between -10 and 10, get their sum then print it to the console.
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

export default RandomLargeSum

