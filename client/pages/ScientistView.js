import React, { Component } from 'react'
import {
  Tabs,
  Tab
} from 'react-bootstrap'

import axios from 'axios'

import TravelingSalesmanAdminInputs from '../components/TravelingSalesmanAdminInputs/TravelingSalesmanAdminInputs';

import {
  StatusBulbs,
  LastExecutionInfo,
  ConsoleOutput,
  HistoryTable,
  Toolbar
} from '../components'

const TRAVELLING_SALESMAN = 'TRAVELLING_SALESMAN'
const START_TRAVELLING_SALESMAN = 'START_TRAVELLING_SALESMAN'
const UPDATE_TRAVELLING_SALESMAN = 'UPDATE_TRAVELLING_SALESMAN'
const UPDATE_HISTORY_TRAVELLING_SALESMAN = 'UPDATE_HISTORY_TRAVELLING_SALESMAN'

const GENETIC_ALGORITHM = 'GENETIC_ALGORITHM'
const ADMIN_JOIN = 'ADMIN_JOIN'
const REQUEST_ROOM = 'REQUEST_ROOM'
const TOGGLE_MULTITHREADED = 'TOGGLE_MULTITHREADED'
const UPDATE_GENETIC_ALGORITHM = 'UPDATE_GENETIC_ALGORITHM'
const UPDATE_HISTORY_GENETIC_ALGORITHM = 'UPDATE_HISTORY_GENETIC_ALGORITHM'


class ScientistView extends Component {
  constructor() {
    super()
    this.state = {
      room: {
        multiThreaded: false,
        nodes: {},
        jobRunning: false
      },
      history: [],
    }
  }
  componentDidMount() {
    axios.get('/api/history/' + GENETIC_ALGORITHM).then((history) => {
      this.setState({ history: history.data })
    })

    this.props.socket.on(UPDATE_GENETIC_ALGORITHM, (room) => {
      this.setState({ room })
    })

    this.props.socket.on(UPDATE_HISTORY_GENETIC_ALGORITHM, (history) => {
      this.setState({ history })
    })

    this.props.socket.emit(ADMIN_JOIN, GENETIC_ALGORITHM)

    this.props.socket.emit(REQUEST_ROOM, GENETIC_ALGORITHM)

    this.props.socket.on('disconnect', () => {
      this.props.socket.on('connect', () => {
        this.props.socket.emit('ADMIN_JOIN', GENETIC_ALGORITHM)
      })
    })
  }

  startJob(evt) {
    this.props.socket.emit(START_TRAVELLING_SALESMAN, this.graph)
  }

  abortJob(evt) {
    this.props.socket.emit('ABORT', GENETIC_ALGORITHM)
  }

  toggleMultiThreaded(evt) {
    this.props.socket.emit(TOGGLE_MULTITHREADED, { value: !this.state.room.multiThreaded, room: GENETIC_ALGORITHM })
  }

  render() {
    // this sorts the table as a side effect
    const mostRecent = this.state.history.length && this.state.history.sort((a, b) => new Date(b.endTime) - new Date(a.endTime))[0]
    const runTime = (new Date(mostRecent.endTime) - new Date(mostRecent.startTime)) / 1000
    return (
      <div>
        <div className="algo-name-header-wrapper">
          <h2>Travelling Salesman Demo</h2>
          <p>
            For each task node for this algorithim finds a subset of the permutations neccesary to determine the shortest tour and send the results back to the root node.
          </p>
        </div>
        <TravelingSalesmanAdminInputs />
        <Toolbar
          startJob={this.startJob.bind(this)}
          abortJob={this.abortJob.bind(this)}
          toggleMultiThreaded={this.toggleMultiThreaded.bind(this)}
          jobRunning={this.state.room.jobRunning}
          multiThreaded={this.state.room.multiThreaded || false}
          nodesInRoom={Object.keys(this.state.room.nodes || {}).length > 0}
        />
        <div><em>Node count: {(this.state.room.nodes) ? Object.keys(this.state.room.nodes).length : 0}</em></div>
        <StatusBulbs nodes={this.state.room.nodes} />
        <LastExecutionInfo result={mostRecent.result} runTime={runTime} />
        <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
          <Tab style={{ marginTop: '0.5em' }} eventKey={1} title="History">
            <HistoryTable data={this.state.history} />
          </Tab>
          <Tab style={{ marginTop: '0.5em' }} eventKey={2} title="Output">
            <ConsoleOutput />
          </Tab>
        </Tabs>
      </div >
    )
  }
}

export default ScientistView
