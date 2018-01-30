import React, { Component } from 'react'
import axios from 'axios'
import {
  Col,
  Form
} from 'react-bootstrap'
import {
  Input,
  Select
} from '../'
import CodeEditor from '../CodeEditor/CodeEditor'
import MutationFuncTable from './MutationFuncTable'
import './style.css'

class AdminInputs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectionFuncs: [],
      mutationFuncs: [],
    }
    this.jobTypes = [{ id: 1, value: 'hello' }]
  }
  componentDidMount() {
    this.fetchMutuationAlgorithms()
    this.fetchSelectionAlgorithms()
  }
  fetchMutuationAlgorithms() {
    axios.get('/api/mutation-algs')
      .then(funcs => this.setState({ mutationFuncs: funcs.data }))
  }
  fetchSelectionAlgorithms() {
    axios.get('/api/selection-algs')
      .then(funcs => this.setState({ selectionFuncs: funcs.data }))
  }

  render() {
    return (
      <div id="scientist-inputs">
        <div id="code-editor">
          <CodeEditor
            fitnessFunc={this.props.fitnessFunc}
            setFitnessFunc={this.props.setFitnessFunc}
          />
        </div>
        <div>
          <h3>Parameters</h3>
          <div className="sliders">
            <Form>
              <Col sm={6}>
                <Input
                  controlId="populationSize"
                  label="Population Size"
                  value={this.props.population}
                  placeholder="Enter population size"
                  type="number"
                  onChange={(e, pop) => this.props.setPopulationSize(pop)}
                />
                <Input
                  controlId="generations"
                  label="Number of generations"
                  type="number"
                  value={this.props.generations}
                  placeholder="Enter generations"
                  onChange={(e, pop) => this.props.setGenerations(pop)}
                />
                <Input
                  controlId="chromosomeLength"
                  label="Chromosome Length"
                  type="number"
                  value={this.props.chromosomeLength}
                  placeholder="Enter chromosome length"
                  onChange={(e, pop) => this.props.setChromLength(pop)}
                />
              </Col>
              <Col sm={6}>
                <Input
                  controlId="fitnessGoal"
                  label="Fitness Goal"
                  type="number"
                  value={this.props.fitnessGoal}
                  placeholder="Enter fitness goal"
                  onChange={(e, pop) => this.props.setFitnessGoal(pop)}
                />
                <Input
                  controlId="elitism"
                  label="Elitism"
                  type="number"
                  value={this.props.elitism}
                  placeholder="Enter elitism"
                  onChange={(e, pop) => this.props.setElitism(pop)}
                />
                <Select
                  controlId="selectionFunc"
                  label="Selection Algorithm"
                  type="number"
                  options={this.state.selectionFuncs}
                  placeholder="Enter selection Function"
                  onChange={(e, pop) => this.props.setSelectionFunc(pop)}
                />
              </Col>
              <div className="mutation-func-table-wrapper">
                <MutationFuncTable />
              </div>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default AdminInputs
