import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'
import { spawn } from 'threads'
import './style.css'

const GENETIC_ALG = 'GENETIC_ALG'
const LEAVE_GENETIC_ALG = 'LEAVE_GENETIC_ALG'
const CALL_GENETIC_ALG = 'CALL_GENETIC_ALG'

class GeneticCitizen extends Component {

  componentDidMount() {
    this.props.socket.emit('join', GENETIC_ALG)
    this.props.socket.on(CALL_GENETIC_ALG, (task) => {
      this.props.socket.emit('start', GENETIC_ALG)
      try {
        console.log('running: ',task)
        this.runMultiThreaded(task)
      } catch (err) {
        console.error(err)
        this.props.socket.emit('JOB_ERROR', GENETIC_ALG)
      }
    })

    this.props.socket.on('disconnect', () => {
      this.props.socket.on('connect', () => {
        this.props.socket.emit('join', GENETIC_ALG)
      })
    })

    this.props.socket.on('ABORT_' + GENETIC_ALG, () => {
      window.location.reload(true)
    })
  }

  componentWillUnmount() {
    this.props.socket.emit(LEAVE_GENETIC_ALG)
  }

  runMultiThreaded(task) {
    let Selection = eval(task.selection)
    let Mutations = eval(task.mutations)
    let Fitness = eval(task.fitness)
    let population = task.population

    let fittest = []


    const thread = spawn(({ chromosomes, fitnessfunc }, done) => {
      let fitnessess = chromosomes.map(v => fitnessfunc(v))
      done({ chromosomes, fitnessess })
    })


    Promise.all([
      thread.send(population.slice(0, Math.floor(population.length / 4)), fitnessfunc ).promise(),
      thread.send(population.slice(Math.floor(population.length / 4), Math.floor(population.length / 2)), fitnessfunc ).promise(),
      thread.send(population.slice(Math.floor(population.length / 2), Math.floor(population.length / 4)*3), fitnessfunc ).promise(),
      thread.send(population.slice(Math.floor(population.length / 4)*3), fitnessfunc ).promise()
    ])
    .then(all => {
      let pop = all[0].chromosomes.concat(all[1].chromosomes, all[2].chromosomes, all[3].chromosomes)
      let fitpop = all[0].fitnessess.concat(all[1].fitnessess, all[2].fitnessess, all[3].fitnessess)
      fittest = Selection(pop,fitpop,2)
      mutations.forEach(m=>{
        fittest = m(fittest)
      })
    })

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

GeneticCitizen.propTypes = {}

export default GeneticCitizen
