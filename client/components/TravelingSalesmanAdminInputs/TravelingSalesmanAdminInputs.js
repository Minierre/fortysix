import React, { Component } from 'react'
import times from 'lodash/times'
import './style.css'
import map from 'lodash/map'
import ReactLoading from 'react-loading';
import CodeEditor from '../CodeEditor/CodeEditor'
import Slider from 'material-ui/Slider';
import './style.css'

import axios from 'axios'

import {
  DropdownButton,
  MenuItem,
  Well
} from 'react-bootstrap'

class AlgorithmInputs extends Component {
  constructor() {
    super();
    this.state = { fitnessFunc: {},
      currentSelectionFunc: {},
      currentMutationFunc: {},
      selectionFuncs: [],
      mutationFuncs: [],
      population: 500,
      generations: 10
    }
    this.handleSelectDropdownSelection = this.handleSelectDropdownSelection.bind(this)
    this.handleMutationDropdownSelection = this.handleMutationDropdownSelection.bind(this)
    this.handlePopSliderChange = this.handlePopSliderChange.bind(this)
    this.handleGenSliderChange = this.handleGenSliderChange.bind(this)
  }
  componentDidMount() {
    this.fetchMutuationAlgorithms();
    this.fetchSelectionAlgorithms();
  }
  fetchMutuationAlgorithms() {
    axios.get('/api/mutation-algs')
      .then(funcs => this.setState({ mutationFuncs: funcs.data }))
  }
  fetchSelectionAlgorithms() {
    axios.get('/api/selection-algs')
      .then(funcs => this.setState({ selectionFuncs: funcs.data }))
  }
  saveFitnessFunc(func) {
    axios.post('/api/fitnessFunc', func)
      .then(fitnessFunc => this.setState({ fitnessFunc }))
  }
  // dynamically handles a selection for a dropdown menu
  handleSelectDropdownSelection(e) {
    this.setState({ currentSelectionFunc: this.state.selectionFuncs[e] })
  }
  handleMutationDropdownSelection(e) {
    this.setState({ currentMutationFunc: this.state.mutationFuncs[e] })
  }
  handlePopSliderChange(e, population) {
    this.setState({ population });
  }
  handleGenSliderChange(e, generations) {
    this.setState({ generations });
  }

  render() {
    return (
      <div id="scientist-inputs">
        <div id="code-editor">
          <CodeEditor />
        </div>
        <div>
          <DropdownButton
            onSelect={this.handleSelectDropdownSelection}
            title={(this.state.currentSelectionFunc && this.state.currentSelectionFunc.name) || 'Select a Selection Algorithm'}
            id="selection-algorithm-dropdown"
          >
            {this.state.selectionFuncs.map((func, idx) =>
              <MenuItem key={func.id} eventKey={idx}>{func.name}</MenuItem>
            )}
          </DropdownButton>
          <DropdownButton
            onSelect={this.handleMutationDropdownSelection}
            title={(this.state.currentMutationFunc && this.state.currentMutationFunc.name) || 'Select a Mutation Algorithm'}
            id="mutations-algorithm-dropdown"
          >
            {this.state.mutationFuncs.map((func, idx) =>
              <MenuItem key={func.id} eventKey={idx}>{func.name}</MenuItem>
            )}
          </DropdownButton>
          <div className="sliders">
            <div className="slider">
              <h5>Population Size</h5>
              <Well className="input-information-well">{this.state.population}</Well>
              <Slider
                className="scientist-input-sliders"
                onChange={this.handlePopSliderChange}
                value={this.state.population}
                style={{ width: 200 }}
                defaultValue={this.state.population}
                min={100}
                max={1000}
                step={2}
              />
            </div>
            <div className="slider">
              <h5>Number of Generations</h5>
              <Well className="input-information-well">{this.state.generations}</Well>
              <Slider
                className="scientist-input-sliders"
                onChange={this.handleGenSliderChange}
                value={this.state.generations}
                style={{ width: 200 }}
                defaultValue={this.state.generations}
                min={5}
                max={50}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AlgorithmInputs
