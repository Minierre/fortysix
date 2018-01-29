import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {
  Tabs,
  Tab
} from 'react-bootstrap'
import axios from 'axios'
import AdminInputs from '../components/AdminInputs/AdminInputs'
import {
  StatusBulbs,
  LastExecutionInfo,
  ConsoleOutput,
  HistoryTable,
  Toolbar
} from '../components'

const ADMIN_JOIN = 'ADMIN_JOIN'
const REQUEST_ROOM = 'REQUEST_ROOM'
const TOGGLE_MULTITHREADED = 'TOGGLE_MULTITHREADED'

class ScientistView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      room: {
        multiThreaded: false,
        nodes: {},
        jobRunning: false
      },
      roomPersisted: {
        roomName: '',
        fitnessFunc: null
      },
      history: [],
      population: 6,
      generations: 6,
      currentSelectionFunc: {},
      currentMutationFunc: {},
      chromosomeLength: 100
    }
    this.setMutationFuncs = this.setMutationFuncs.bind(this);
    this.setSelectionFunc = this.setSelectionFunc.bind(this);
    this.setPopulationSize = this.setPopulationSize.bind(this);
    this.setGenerations = this.setGenerations.bind(this);
    this.setChromLength = this.setChromLength.bind(this);
    this.saveFitnessFunc = this.saveFitnessFunc.bind(this);
    this.setFitnessFunc = this.setFitnessFunc.bind(this);
  }
  componentDidMount() {
    const roomHash = this.props.match.params.roomHash;
    axios.get('/api/history/' + roomHash).then((history) => {
      this.setState({ history: history.data })
    })

    axios.get('/api/room/' + roomHash).then((roomPersisted) => {
      this.setState({ roomPersisted: roomPersisted.data })
    })

    this.props.socket.on("UPDATE_" + roomHash, (room) => {
      this.setState({ room })
    })

    this.props.socket.on("UPDATE_HISTORY_" + roomHash, (history) => {
      this.setState({ history })
    })

    this.props.socket.emit(ADMIN_JOIN, roomHash)

    this.props.socket.emit(REQUEST_ROOM, roomHash)

    this.props.socket.on('disconnect', () => {
      this.props.socket.on('connect', () => {
        this.props.socket.emit('ADMIN_JOIN', roomHash)
      })
    })
  }

  startJob(evt) {
    const roomHash = this.props.match.params.roomHash
    let parameters = {
      params: {
        population: this.state.population,
        generations: this.state.generations,
        currentSelectionFunc: this.state.currentSelectionFunc.id,
        currentMutationFunc: this.state.currentMutationFunc.id,
        chromosomeLength: this.state.chromosomeLength
      },
      room: this.state.room
    }
    this.props.socket.emit("START_" + roomHash, parameters)
  }

  abortJob(evt) {
    const roomHash = this.props.match.params.roomHash
    this.props.socket.emit('ABORT', roomHash)
  }

  toggleMultiThreaded(evt) {
    const roomHash = this.props.match.params.roomHash
    this.props.socket.emit(TOGGLE_MULTITHREADED, {
      value: !this.state.room.multiThreaded,
      room: roomHash
    })
  }

  saveFitnessFunc() {
    const fitnessFunc = this.state.roomPersisted.fitnessFunc
    const roomHash = this.props.match.params.roomHash
    axios.put('/api/room/' + roomHash, { fitnessFunc })
      .then((roomPersisted) => {
        this.setState({ roomPersisted: roomPersisted.data })
      })
  }

  setFitnessFunc(fitnessFunc) {
    this.setState({
      roomPersisted: {
        ...this.state.roomPersisted,
        fitnessFunc
      }
    })
  }

  setMutationFuncs(currentMutationFunc) {
    this.setState(currentMutationFunc)
  }

  setSelectionFunc(currentSelectionFunc) {
    this.setState(currentSelectionFunc)
  }

  setPopulationSize(population) {
    this.setState({ population })
  }

  setGenerations(generations) {
    this.setState({ generations })
  }

  setChromLength(chromosomeLength) {
    this.setState({ chromosomeLength })
  }

  render() {
    // this sorts the table as a side effect
    const mostRecent = this.state.history.length && this.state.history.sort((a, b) => new Date(b.endTime) - new Date(a.endTime))[0]
    const runTime = (new Date(mostRecent.endTime) - new Date(mostRecent.startTime)) / 1000
    return (
      <div>
        <div className="algo-name-header-wrapper">
          <h2>{this.state.roomPersisted.roomName}</h2>
          <p>
            Enter a Fitness Function in the Code Editor Below.
          </p>
        </div>
        <AdminInputs
          fitnessFunc={this.state.roomPersisted.fitnessFunc}
          saveFitnessFunc={this.saveFitnessFunc}
          setFitnessFunc={this.setFitnessFunc}
          setMutationFuncs={this.setMutationFuncs}
          setSelectionFunc={this.setSelectionFunc}
          setPopulationSize={this.setPopulationSize}
          setGenerations={this.setGenerations}
          setChromLength={this.setChromLength}
          currentSelectionFunc={this.state.currentSelectionFunc}
          currentMutationFunc={this.state.currentMutationFunc}
          population={this.state.population}
          generations={this.state.generations}
          chromosomeLength={this.state.chromosomeLength}
        />
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
        <h4><strong>Chromosomes Processed:</strong> <em>{this.state.room.chromesomesReturned}</em></h4>
        <h4><strong>Total Fitness:</strong> <em>{this.state.room.totalFitness}</em></h4>
        <h4><strong>Average Fitness:</strong> <em>{this.state.room.totalFitness / this.state.room.chromesomesReturned}</em></h4>
        <LastExecutionInfo result={mostRecent.result} runTime={runTime} />
        <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
          <Tab style={{ marginTop: '0.5em' }} eventKey={1} title="History">
            <HistoryTable data={this.state.history} />
          </Tab>
          <Tab style={{ marginTop: '0.5em' }} eventKey={2} title="Output">
            <ConsoleOutput />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default withRouter(ScientistView)
