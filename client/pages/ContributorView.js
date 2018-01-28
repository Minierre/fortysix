import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'
import { spawn } from 'threads'
import { withRouter } from 'react-router-dom'
import './style.css'

class ContributorView extends Component {

  componentDidMount() {
    const roomHash = this.props.match.params.roomHash
    this.props.socket.emit('join', roomHash)
    this.props.socket.on("CALL_" + roomHash, (task) => {
      this.props.socket.emit('start', roomHash)
      try {
        console.log('running: ', task)
        this.runMultiThreaded(task)
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

  componentWillUnmount() {
    const roomHash = this.props.match.params.roomHash
    this.props.socket.emit("LEAVE_" + roomHash)
  }

  runMultiThreaded(task) {
    const roomHash = this.props.match.params.roomHash
    let Selection = eval('(' + task.selection.function + ')')
    let Mutations = task.mutations.map(v=>eval('(' + v.function + ')'))
    let Fitness = task.fitness
    let population = task.population
    let fittest = []

    const thread = spawn(({ chromosomes, fitnessfunc }, done) => {
      const F = eval('(' + fitnessfunc.function + ')')
      const fitnessess = chromosomes.map(v => F(v))
      done({ chromosomes, fitnessess })
    })

    Promise.all([
      thread.send({ chromosomes: population.slice(0, Math.floor(population.length / 4)), fitnessfunc: Fitness }).promise(),
      thread.send({ chromosomes: population.slice(Math.floor(population.length / 4), Math.floor(population.length / 2)), fitnessfunc: Fitness }).promise(),
      thread.send({ chromosomes: population.slice(Math.floor(population.length / 2), Math.floor(population.length / 4) * 3), fitnessfunc: Fitness }).promise(),
      thread.send({ chromosomes: population.slice(Math.floor(population.length / 4) * 3), fitnessfunc: Fitness }).promise()
    ])
      .then((all) => {
        const pop = all[0].chromosomes.concat(all[1].chromosomes, all[2].chromosomes, all[3].chromosomes)
        const fitpop = all[0].fitnessess.concat(all[1].fitnessess, all[2].fitnessess, all[3].fitnessess)
        fittest = Selection(pop, fitpop, 2)
        const memo = []
        const fitnesses = pop.reduce((a, b, i) => {
          if (fittest.includes(b) && !memo.includes(b)) {
            memo.push(b)
            a.push(fitpop[i])
          }
          return a
        }, [])

        Mutations.forEach((m) => {
          fittest = m(fittest)
        })

        const returnTaskObj = {
          fitnesses,
          room: this.props.match.params.roomHash,
          id: task.id,
          population: fittest,
          gen: task.gen + 1,
          fitness: task.fitness,
          selection: task.selection,
          mutations: task.mutations
        }
        this.props.socket.emit('done', returnTaskObj)
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

export default withRouter(ContributorView)
