import React, { Component } from 'react'
import Slider from 'material-ui/Slider'
import axios from 'axios'
import {
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Form
} from 'react-bootstrap'
import CodeEditor from '../CodeEditor/CodeEditor'
import MutationFuncTable from './MutationFuncTable'
import './style.css'

class AdminInputs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectionFuncs: [],
      mutationFuncs: [],
      mutationFunctions: [{ id: 1, function: 'test', probability: 10 }]
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
                <FormGroup
                  controlId="formBasicText"
                >
                  <ControlLabel>Population Size</ControlLabel>
                  <FormControl
                    type="number"
                    value={this.props.population}
                    placeholder="Enter text"
                    onChange={(e, pop) => this.props.setPopulationSize(pop)}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  controlId="formBasicText"
                >
                  <ControlLabel>Number of Generations</ControlLabel>
                  <FormControl
                    type="number"
                    value={this.props.generations}
                    placeholder="Enter text"
                    onChange={(e, pop) => this.props.setGenerations(pop)}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  controlId="formBasicText"
                >
                  <ControlLabel>Chromosome Length</ControlLabel>
                  <FormControl
                    type="number"
                    value={this.props.chromosomeLength}
                    placeholder="Enter text"
                    onChange={(e, pop) => this.props.setChromLength(pop)}
                  />
                  <FormControl.Feedback />
                </FormGroup>

              </Col>
              <Col sm={6}>
                  <FormGroup
                    controlId="formBasicText"
                  >
                  <ControlLabel>Fitness Goal</ControlLabel>
                  <FormControl
                    type="number"
                    value={this.props.chromosomeLength}
                    placeholder="Enter text"
                    onChange={(e, pop) => this.props.setChromLength(pop)}
                  />
                  <FormControl.Feedback />
              </FormGroup>
                <FormGroup
                  controlId="formBasicText"
                >
                  <ControlLabel>Elitism</ControlLabel>
                  <FormControl
                    type="number"
                    value={this.props.chromosomeLength}
                    placeholder="Enter text"
                    onChange={(e, pop) => this.props.setChromLength(pop)}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  controlId="formBasicText"
                >
                  <ControlLabel>Selection Algorithm</ControlLabel>
                  <FormControl
                    componentClass="select"
                    placeholder="select"
                    onSelect={(e) => this.props.setSelectionFunc({ currentSelectionFunc: this.state.selectionFuncs[e] })}
                  >
                    {this.state.selectionFuncs.map((func, idx) =>
                      <option key={func.id} value={idx}>{func.name}</option>
                    )}
                  </FormControl>
                  <FormControl.Feedback />
                </FormGroup>
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
