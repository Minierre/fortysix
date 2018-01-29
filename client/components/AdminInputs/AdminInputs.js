import React, { Component } from 'react'
import Slider from 'material-ui/Slider'
import axios from 'axios'
import {
  DropdownButton,
  MenuItem,
  Well,
  FormGroup,
  ControlLabel,
  FormControl,
  Form
} from 'react-bootstrap'
import CodeEditor from '../CodeEditor/CodeEditor'
import './style.css'

class AdminInputs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectionFuncs: [],
      mutationFuncs: [],
    }
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
          <DropdownButton
            onSelect={(e) => this.props.setSelectionFunc({ currentSelectionFunc: this.state.selectionFuncs[e] })}
            title={(this.props.currentSelectionFunc && this.props.currentSelectionFunc.name) || 'Select a Selection Algorithm'}
            id="selection-algorithm-dropdown"
          >
            {this.state.selectionFuncs.map((func, idx) =>
              <MenuItem key={func.id} eventKey={idx}>{func.name}</MenuItem>
            )}
          </DropdownButton>

          <DropdownButton onSelect={(e => this.props.setMutationFuncs(
            { currentMutationFunc: this.state.mutationFuncs[e] }))}
            title={(this.props.currentMutationFunc && this.props.currentMutationFunc.name) || 'Select a Mutation Algorithm'}
            id="mutations-algorithm-dropdown"
          >
            {this.state.mutationFuncs.map((func, idx) =>
              <MenuItem key={func.id} eventKey={idx}>{func.name}</MenuItem>
            )}
          </DropdownButton>

          <div className="sliders">
            <Form>
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
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default AdminInputs
