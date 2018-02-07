import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'
import { spawn } from 'threads'
import { withRouter } from 'react-router-dom'

class ContributorView extends Component {

  componentDidMount() {
    const roomHash = this.props.match.params.roomHash
    this.props.socket.emit('join', roomHash)
    this.props.socket.on("CALL_STATS" + roomHash, (task) => {
      // this.props.socket.emit('start', roomHash)
      try {
        console.log('running: ', task)
        this.runstats(task)
      } catch (err) {
        console.error(err)
        this.props.socket.emit('JOB_ERROR', {
          roomHash, error: err.toString()
        })
      }
    })

    this.props.socket.on('disconnect', () => {
      this.props.socket.on('connect', () => {
        this.props.socket.emit('join', roomHash)
      })
    })

    this.props.socket.on('ABORT_' + roomHash, () => {
      window.location.reload(true)
    })
  }

  binaryInsertion(array, value) {
    const index = sortedIndex(array, value)
    return array.slice(0, index).concat(value, array.slice(index))
  }

  runStats({ genOneFitnessData, generationOneFitnessesData }) {
    let newGenerationOneFitnessesData = generationOneFitnessesData
    genOneFitnessData.forEach((fitness) => {
      newGenerationOneFitnessesData = binaryInsertion(newGenerationOneFitnessesData, Math.log(fitness + 1))
    })
    socket.emit('DONE_STATS_' + roomHash, newGenerationOneFitnessesData)
  }
}

componentWillUnmount() {
  const roomHash = this.props.match.params.roomHash
  this.props.socket.emit('leave', roomHash)
}

render() {
  return (
    <Panel>
      <Panel.Heading>
        <Panel.Title componentClass="h3">
          By having this page open you are contributing to science.
          </Panel.Title>
      </Panel.Heading>
      <Panel.Body>Thank you for contributing to science.</Panel.Body>
    </Panel>
  )
}
}

export default withRouter(ContributorView)
