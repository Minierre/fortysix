import React, { Component } from 'react'
import {
  Tabs,
  Tab
} from 'react-bootstrap'

import axios from 'axios'

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
const REQUEST_ROOM = 'REQUEST_ROOM'
const UPDATE_HISTORY_TRAVELLING_SALESMAN = 'UPDATE_HISTORY_TRAVELLING_SALESMAN'
const TOGGLE_MULTITHREADED = 'TOGGLE_MULTITHREADED'

class TravellingSalesman extends Component {

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
    //  const threcadecaNode = {
    //   a: { b: 1, c: 3, d: 4, e: 4, f: 1, g: 4, h: 1, i: 2, j: 7, k: 8, l: 3, m: 10 },
    //   b: { a: 25, c: 4, d: 5, e: 1, f: 72, g: 13, h: 4, i: 1, j: 3, k: 3, l: 1, m: 1 },
    //   c: { b: 1, a: 2, d: 4, e: 9, f: 3, g: 4, h: 4, i: 1, j: 26, k: 2, l: 9, m: 6 },
    //   d: { b: 2, c: 1, a: 3, e: 4, f: 1, g: 45, h: 5, i: 3, j: 28, k: 8, l: 8, m: 7 },
    //   e: { b: 46, c: 1, d: 50, a: 8, f: 1, g: 3, h: 1, i: 2, j: 32, k: 8, l: 8, m: 2 },
    //   f: { b: 8, c: 9, d: 3, e: 6, a: 7, g: 1, h: 90, i: 2, j: 7, k: 8, l: 2, m: 9 },
    //   g: { b: 6, c: 8, d: 9, e: 5, f: 9, a: 7, h: 1, i: 22, j: 71, k: 8, l: 4, m: 5 },
    //   h: { b: 4, c: 7, d: 9, e: 2, f: 4, g: 8, a: 12, i: 3, j: 7, k: 18, l: 3, m: 2 },
    //   i: { b: 1, c: 15, d: 6, e: 3, f: 12, g: 75, h: 23, a: 62, j: 7, k: 85, l: 7, m: 4 },
    //   j: { b: 9, c: 4, d: 5, e: 8, f: 33, g: 7, h: 9, i: 5, a: 57, k: 28, l: 6, m: 6 },
    //   k: { b: 7, c: 3, d: 76, e: 11, f: 12, g: 31, h: 56, i: 2, j: 47, a: 8, l: 11, m: 3 },
    //   l: { b: 3, c: 12, d: 4, e: 5, f: 4, g: 1, h: 1, i: 4, j: 71, k: 98, a: 4, m: 1 },
    //   m: { b: 4, c: 2, d: 1, e: 2, f: 7, g: 1, h: 1, i: 1, j: 7, k: 89, l: 3, a: 2 }
    // }
    // this.graph = {
    //   a: { b: 1, c: 3, d: 4, e: 4, f: 1, g: 4, h: 1, i: 2, j: 7, k: 8 , l:9},
    //   b: { a: 25, c: 4, d: 5, e: 1, f: 72, g: 13, h: 4, i: 1, j: 3, k: 3 , l:3},
    //   c: { b: 1, a: 2, d: 4, e: 9, f: 3, g: 4, h: 4, i: 1, j: 26, k: 2 , l:2},
    //   d: { b: 2, c: 1, a: 3, e: 4, f: 1, g: 45, h: 5, i: 3, j: 28, k: 8 , l:4},
    //   e: { b: 46, c: 1, d: 50, a: 8, f: 1, g: 3, h: 1, i: 2, j: 32, k: 8 , l:5},
    //   f: { b: 8, c: 9, d: 3, e: 6, a: 7, g: 1, h: 90, i: 2, j: 7, k: 8 , l:12},
    //   g: { b: 6, c: 8, d: 9, e: 5, f: 9, a: 7, h: 1, i: 22, j: 71, k: 8 , l:11},
    //   h: { b: 4, c: 7, d: 9, e: 2, f: 4, g: 8, a: 12, i: 3, j: 7, k: 18 , l:20},
    //   i: { b: 1, c: 15, d: 6, e: 3, f: 12, g: 75, h: 23, a: 62, j: 7, k: 85 , l:19},
    //   j: { b: 9, c: 4, d: 5, e: 8, f: 33, g: 7, h: 9, i: 5, a: 57, k: 28 , l:7},
    //   k: { b: 7, c: 3, d: 76, e: 11, f: 12, g: 31, h: 56, i: 2, j: 47, a: 8 , l:5},
    //   l: { b: 4, c: 5, d: 6, e: 19, f: 2, g: 3, h: 5, i: 24, j: 7, a: 13 , k:9}
    // }
    this.graph = {
      a: { b: 1, c: 3, d: 4, e: 4, f: 1, g: 4, h: 1, i: 2, j: 7, k: 8 },
      b: { a: 25, c: 4, d: 5, e: 1, f: 72, g: 13, h: 4, i: 1, j: 3, k: 3 },
      c: { b: 1, a: 2, d: 4, e: 9, f: 3, g: 4, h: 4, i: 1, j: 26, k: 2 },
      d: { b: 2, c: 1, a: 3, e: 4, f: 1, g: 45, h: 5, i: 3, j: 28, k: 8 },
      e: { b: 46, c: 1, d: 50, a: 8, f: 1, g: 3, h: 1, i: 2, j: 32, k: 8 },
      f: { b: 8, c: 9, d: 3, e: 6, a: 7, g: 1, h: 90, i: 2, j: 7, k: 8 },
      g: { b: 6, c: 8, d: 9, e: 5, f: 9, a: 7, h: 1, i: 22, j: 71, k: 8 },
      h: { b: 4, c: 7, d: 9, e: 2, f: 4, g: 8, a: 12, i: 3, j: 7, k: 18 },
      i: { b: 1, c: 15, d: 6, e: 3, f: 12, g: 75, h: 23, a: 62, j: 7, k: 85 },
      j: { b: 9, c: 4, d: 5, e: 8, f: 33, g: 7, h: 9, i: 5, a: 57, k: 28 },
      k: { b: 7, c: 3, d: 76, e: 11, f: 12, g: 31, h: 56, i: 2, j: 47, a: 8 }
    }
  }
  componentDidMount() {

    axios.get('/api/history/' + TRAVELLING_SALESMAN).then((history) => {
      this.setState({ history: history.data })
    })

    this.props.socket.on(UPDATE_TRAVELLING_SALESMAN, (room) => {
      this.setState({ room })
    })

    this.props.socket.on(UPDATE_HISTORY_TRAVELLING_SALESMAN, (history) => {
      this.setState({ history })
    })

    this.props.socket.emit(REQUEST_ROOM, TRAVELLING_SALESMAN)
  }

  startJob(evt) {
    this.props.socket.emit(START_TRAVELLING_SALESMAN, this.graph)
  }

  abortJob(evt) {
    this.props.socket.emit('ABORT', TRAVELLING_SALESMAN)
  }

  toggleMultiThreaded(evt) {
    this.props.socket.emit(TOGGLE_MULTITHREADED, { value: !this.state.room.multiThreaded, room: 'TRAVELLING_SALESMAN' })
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

export default TravellingSalesman

