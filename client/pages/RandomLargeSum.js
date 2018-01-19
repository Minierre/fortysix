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


class RandomLargeSum extends Component {

  constructor() {
    super()
    this.state = {
      nodeCount: 0
    }
  }
  componentDidMount() {
    this.props.socket.on('updateCount-hugeSum', (nodeCount) => {
      this.setState({ nodeCount })
    })

    this.props.socket.on('getRoomCount-hugeSum', (nodeCount) => {
      this.setState({ nodeCount })
    })

    this.props.socket.emit('requestRoomCount', 'hugeSum')
  }

  onClick(evt) {
    this.props.socket.emit('startHugeSum')
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
        <StatusBulbs count={this.state.nodeCount} />
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

