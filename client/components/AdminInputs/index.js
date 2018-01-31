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
    }
  }
  componentDidMount() {
    this.fetchSelectionAlgorithms()
  }
  fetchSelectionAlgorithms() {
    axios.get('/api/selection-algs')
      .then(funcs => this.setState({ selectionFuncs: funcs.data }))
  }

  render() {
    const { values } = this.props

    return (
      <div id="scientist-inputs">
        <div id="code-editor">
          <CodeEditor
            fitnessFunc={values.fitnessFunc}
            submit={this.props.submit}
            onChange={this.props.onChange}
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
                  value={values.populationSize}
                  placeholder="Enter population size"
                  type="number"
                  onBlur={this.props.submit}
                  onChange={this.props.onChange}
                />
                <Input
                  controlId="generations"
                  label="Number of generations"
                  type="number"
                  value={values.generations}
                  placeholder="Enter generations"
                  onBlur={this.props.submit}
                  onChange={this.props.onChange}
                />
                <Input
                  controlId="chromosomeLength"
                  label="Chromosome Length"
                  type="number"
                  value={values.chromosomeLength}
                  placeholder="Enter chromosome length"
                  onBlur={this.props.submit}
                  onChange={this.props.onChange}
                />
              </Col>
              <Col sm={6}>
                <Input
                  controlId="fitnessGoal"
                  label="Fitness Goal"
                  type="number"
                  value={values.fitnessGoal}
                  placeholder="Enter fitness goal"
                  onBlur={this.props.submit}
                  onChange={this.props.onChange}
                />
                <Input
                  controlId="elitism"
                  label="Elitism"
                  type="number"
                  value={values.elitism}
                  placeholder="Enter elitism"
                  onBlur={this.props.submit}
                  onChange={this.props.onChange}
                />
                <Select
                  controlId="selectionFunc"
                  label="Selection Algorithm"
                  type="number"
                  value={values.selection && values.selection.id}
                  options={this.state.selectionFuncs}
                  placeholder="Enter selection Function"
                  onBlur={this.props.submit}
                  onChange={this.props.onChange}
                />
              </Col>
              <div className="mutation-func-table-wrapper">
                <MutationFuncTable
                  submit={this.props.submit}
                  onChange={this.props.onChange}
                  functions={values.mutations}
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

AdminInputs.defaultProps = {
  values: {
    parameters: []
  }
}

export default AdminInputs
