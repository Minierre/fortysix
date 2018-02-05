import React, { Component } from 'react'
import { Panel, Button, Table } from 'react-bootstrap'
import { spawn } from 'threads'
import { withRouter } from 'react-router-dom'

class ContributorView extends Component {
  constructor() {
    super()
    this.state = {
      tasksCompleted: 0,
      percentOfTotal: 0,
      timeRunning: 0,
      taskPerSecond: 0,
      ready: false
    }
    this.handleStart = this.handleStart.bind(this)
    this.handleStop = this.handleStop.bind(this)
  }

  componentDidMount() {
    const roomHash = this.props.match.params.roomHash
    this.props.socket.emit('join', roomHash)
    this.props.socket.on("CALL_" + roomHash, ( { task, tasksCompleted }  ) => {
    this.setState({tasksCompleted})
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
    this.props.socket.emit('leave', roomHash)
  }

  runMultiThreaded(task) {
    const roomHash = this.props.match.params.roomHash
    const Selection = eval('(' + task.selection.function + ')')
    const Mutations = task.mutations.map( (mutation) => {
      return ({ function: eval('(' + mutation.function + ')'), chanceOfMutation: mutation.chanceOfMutation })
    })
    let Fitness = task.fitness
    let population = task.population
    let fittest = []



    const FF = eval('(' + task.fitness.function + ')')

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
        thread.kill()

        const pop = all[0].chromosomes.concat(all[1].chromosomes, all[2].chromosomes, all[3].chromosomes)
        const fitpop = all[0].fitnessess.concat(all[1].fitnessess, all[2].fitnessess, all[3].fitnessess)

        fittest = Selection(pop, fitpop, 2)

        const parents = fittest.slice()
        fittest = []
        for (let i = 0; i < task.reproductiveCoefficient; i++) {
          let children = parents.slice()
          Mutations.forEach((m) => {
            children = m.function(children, m.chanceOfMutation, task.genePool)
          })
          fittest = fittest.concat(children)
        }

        if (task.elitism && task.elitism <= Math.max(...fitpop)) {
          fittest.push(pop[fitpop.indexOf(Math.max(...fitpop))])
        }

        const fitnesses = fittest.map(chromo => FF(chromo))

        const returnTaskObj = {
          fitnesses,
          population: fittest,
          room: this.props.match.params.roomHash,
          id: task.id,
          gen: task.gen + 1,
          fitness: task.fitness,
          selection: task.selection,
          mutations: task.mutations,
          genePool: task.genePool,
          reproductiveCoefficient: task.reproductiveCoefficient,
          elitism: task.elitism,
          genOneFitnessData: (task.gen === 1) ? fitpop : null
        }

        this.props.socket.emit('done', returnTaskObj)
      })
  }

  handleStart(){
    this.setState({ready:true})
    const roomHash = this.props.match.params.roomHash
      setInterval(() => {
        if (this.state.ready) {
          let timePassed = this.state.timeRunning
          timePassed++
          this.setState({timeRunning:timePassed})
          let taskPerSecond = (this.state.tasksCompleted / this.state.timeRunning).toFixed(2)
          this.setState({taskPerSecond})
        }
      }, 1000)
    this.props.socket.emit('join', roomHash)
  }

  handleStop(){
    this.setState({ready: false})
    const roomHash = this.props.match.params.roomHash
    this.props.socket.emit('leave', roomHash)
  }

  render() {
    const style = {maxWidth: 400, margin: '0 auto 10px'}
    return (
      <div>
        <Panel>
          <Panel.Heading>
            <Panel.Title componentClass="h3">
              By having this page open you are contributing to science.
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body>Thank you for contributing to science.</Panel.Body>
        </Panel>
        <div style={style}>
        <Button onClick={this.handleStart} bsStyle="success" bsSize="large" block>
        I'm Ready to Receive Tasks
    </Button>
    <Button onClick={this.handleStop} bsStyle="danger" bsSize="large" block>
      Stop Sending Me Tasks
    </Button>
    </div>
    <Table striped hover>
  <tbody>
    <tr>
      <td>Tasks Completed</td>
      <td>{this.state.tasksCompleted}</td>
    </tr>
    <tr>
      <td>Time Running</td>
      <td>{this.state.timeRunning} seconds</td>
    </tr>
    <tr>
      <td>Percent of Total</td>
      <td>{this.state.percentOfTotal} %</td>
    </tr>
    <tr>
      <td>Tasks Per Second</td>
      <td>{this.state.taskPerSecond}</td>
    </tr>
  </tbody>
</Table>;
      </div>
    )
  }
}

export default withRouter(ContributorView)
