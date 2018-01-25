import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'
import { spawn } from 'threads'
import './style.css'

const GENETIC_ALG = 'GENETIC_ALG'
const LEAVE_GENETIC_ALG = 'LEAVE_GENETIC_ALG'
const CALL_GENETIC_ALG = 'CALL_GENETIC_ALG'

const data = {
  room: GENETIC_ALG,
  id: 1,
  gen: 1,
  population:[
    '101001001',
    '100001111',
    '001000001',
    '101101000',
    '001010011',
    '101100010'],
  fitness: ((c, w)=>{
    let memo = {}
    let fitness = 0
    let testingChromosome = c
    function iterate(C, w) {
      if (memo[C]) {
        fitness--
        return ('0').repeat(C.length)
      }
      memo[C] = true
      let newC = ''
      for (var i = 0; i < C.length; i++) {
        let neighbors = 0
        if (Math.floor((i - 1) / w) !== Math.floor(i / w) - 1) {
          if (C[i - 1] === '1') neighbors++
          if (i - 1 - w > 0 && C[i - 1 - w] === '1') neighbors++
          if (i - 1 + w < C.length && C[i - 1 + w] === '1') neighbors++
        }
        if (Math.floor((i + 1) / w) !== Math.floor(i / w) + 1) {
          if (C[i + 1] === '1') neighbors++
          if (i + 1 - w > 0 && C[i + 1 - w] === '1') neighbors++
          if (i + 1 + w < C.length && C[i + 1 + w] === '1') neighbors++
        }
        if (i - w > 0 && C[i - w] === '1') neighbors++
        if (i + w < C.length && C[i + w] === '1') neighbors++

        if (neighbors === 3 && C[i] === '0') newC += '1'
        else if (neighbors < 2 && C[i] === '1') newC += '0'
        else if (neighbors > 3 && C[i] === '1') newC += '0'
        else newC += C[i]
      }
      return newC
    }
    while (testingChromosome !== ('0').repeat(c.length)) {
      testingChromosome = iterate(testingChromosome, 3)
      fitness++
    }
    return fitness
  }).toString(),
  mutations: [
    ((pop, p)=>{
      return pop.map(v => v.split('').map(v => (Math.random() < p) ? (v === '0') ? '1' : '0' : v).join(''))
    }).toString(),
    ((pop, p)=>{
      for (var j = 1; j < pop.length; j++) {
        let c1 = pop[i]
        let c2 = pop[i - 1]
        if (Math.random() < p) {
          let i = Math.floor(Math.random() * (c1.length - 1))
          i++
          let c1b = c1.slice(0, i) + c2.slice(i)
          let c2b = c2.slice(0, i) + c1.slice(i)
          c1 = c1b
          c2 = c2b
        }
      }
      return pop
    }).toString()],
  selection: ((population, arrayOfFitnesses, n = 1)=>{
    let numSelectionsLeft = n;
    let selections = [];
    let totalFit = arrayOfFitnesses.reduce((a, b) => a + b, 0);
    let j = 0
    while (numSelectionsLeft > 0) {
      let randomFitnessLvl = Math.random() * totalFit;
      for (let i = 0; i < arrayOfFitnesses.length; i++) {
        randomFitnessLvl -= arrayOfFitnesses[i];
        if (randomFitnessLvl <= 0) {
          selections.push(population[i]);
          totalFit -= arrayOfFitnesses[i];
          arrayOfFitnesses[i] = 0;
          numSelectionsLeft -= 1;
          break;
        }
      }
    }
    return selections;
  }).toString()
}




class GeneticCitizen extends Component {

  componentDidMount() {
    this.runMultiThreaded(data)
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
    console.log('IN THE MULTITHREAD', task)
    let Selection = eval('('+task.selection+')')
    console.log(typeof Selection)
    let Mutations = task.mutations.map(v=>eval('('+v+')'))
    let Fitness = eval('('+task.fitness+')')
    let population = task.population
    let fittest = []

    const thread = spawn(({ chromosomes, fitnessfunc }, d) => {
      let fitnessess = chromosomes.map(v => fitnessfunc(v))
    })

    Promise.all([
      thread.send(population.slice(0, Math.floor(population.length / 4)), fitnessfunc).promise(),
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
      console.log(fittest)
      this.props.socket.emit('done', {
        room: GENETIC_ALG,
        id: task.id,
        population: fittest,
        gen: task.gen+1,
        fitness: task.fitness,
        selection: task.selection,
        mutations: task.mutations
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
