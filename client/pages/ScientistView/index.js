import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {
  Tabs,
  Tab,
} from 'react-bootstrap'
import { Formik } from 'formik'
import axios from 'axios'
import JSONTree from 'react-json-tree'
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import Status from './Status'
import History from './History'
import Visualize from './Visualize'
import './style.css'

import {
  AdminInputs,
} from '../../components'

const ADMIN_JOIN = 'ADMIN_JOIN'
const REQUEST_ROOM = 'REQUEST_ROOM'

class ScientistView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      room: {
        multiThreaded: false,
        nodes: {},
        bucket: {},
        jobRunning: false
      },
      roomPersisted: {
        roomName: '',
        fitnessFunc: null
      },
      history: []
    }
    this.startJob = this.startJob.bind(this)
    this.abortJob = this.abortJob.bind(this)
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
        population: this.state.roomPersisted.population,
        generations: this.state.roomPersisted.generations,
        currentSelectionFunc: this.state.roomPersisted.selection,
        currentMutationFunc: this.state.roomPersisted.mutations[0],
        chromosomeLength: this.state.roomPersisted.chromosomeLength,
        reproductiveCoefficient: this.state.roomPersisted.reproductiveCoefficient
      },
      room: this.state.room
    }
    this.props.socket.emit("START_" + roomHash, parameters)
  }

  abortJob(evt) {
    const roomHash = this.props.match.params.roomHash
    this.props.socket.emit('ABORT', roomHash)
  }

  render() {
    const {
      parameters,
      mutations,
      selection,
      fitnessFunc
    } = this.state.roomPersisted
    return (
      <div id="scientist-view-wrapper">
        <h2>{this.state.roomPersisted.roomName}</h2>
        <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
          <Tab style={{ marginTop: '0.5em' }} eventKey={1} title="Edit">
            <h3>
              Enter a Fitness Function in the Code Editor Below.
          </h3>
            <Formik
              enableReinitialize
              initialValues={
                { ...parameters, mutations, selection, fitnessFunc }
              }
              onSubmit={(
                values,
                { setSubmitting, setErrors }
              ) => {
                const roomHash = this.props.match.params.roomHash
                const {
                  chromosomeLength,
                  generations,
                  populationSize,
                  fitnessGoal,
                  fitnessFunc,
                  mutations,
                  selection,
                  genePool,
                  reproductiveCoefficient,
                  elitism
                } = values
                axios.put('/api/room/' + roomHash, {
                  parameters: {
                    id: this.state.roomPersisted.parameters.id,
                    chromosomeLength,
                    generations,
                    populationSize,
                    fitnessGoal,
                    genePool,
                    reproductiveCoefficient,
                    elitism
                  },
                  fitnessFunc,
                  mutations,
                  selection
                })
                  .then((roomPersisted) => {
                    this.setState({ roomPersisted: roomPersisted.data })
                  })
              }}
              render={({
                values,
                errors,
                touched,
                handleSubmit,
                handleChange,
                handleBlur
              }) => (
                <AdminInputs
                  values={values}
                  setParameters={this.updateParameters}
                  submit={handleSubmit}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              )}
            />
          </Tab>
          <Tab style={{ marginTop: '0.5em' }} eventKey={2} title="Run">
            <Status
              nodes={this.state.room.nodes}
              chromosomesReturned={this.state.room.chromosomesReturned}
              totalFitness={this.state.room.totalFitness}
              jobRunning={this.state.room.jobRunning}
              abortJob={this.abortJob}
              startJob={this.startJob}
            />
          </Tab>
          <Tab style={{ marginTop: '0.5em' }} eventKey={3} title="Data">
            <JSONTree data={{
              nodes: this.state.room.nodes,
              buckets: this.state.room.bucket
            }} />
          </Tab>
          <Tab style={{ marginTop: '0.5em' }} eventKey={4} title="Visualize">
            <Visualize data={this.state.room.stats} />
          </Tab>
          <Tab style={{ marginTop: '0.5em' }} eventKey={5} title="History">
            <History history={this.state.history} />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default withRouter(ScientistView)
