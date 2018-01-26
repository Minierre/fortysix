import React, { Component } from 'react'
import times from 'lodash/times'
import './style.css'
import map from 'lodash/map'
import ReactLoading from 'react-loading';
import CodeEditor from '../CodeEditor/CodeEditor'
import Slider from 'material-ui/Slider';

import axios from 'axios'

import {
  DropdownButton,
  MenuItem
} from 'react-bootstrap'

class AlgorithmInputs extends Component {
  constructor() {
    super();
    this.state = { fitnessFunc: {},
      currentSelectionFunc: {},
      currentMutationFunc: {},
      selectionFuncs: [],
      mutationFuncs: []
    }
    this.handleSelectDropdownSelection = this.handleSelectDropdownSelection.bind(this)
    this.handleMutationDropdownSelection = this.handleMutationDropdownSelection.bind(this)
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

  render() {
    console.log(this.state)
    return (
      <div>
        <DropdownButton
          onSelect={this.handleSelectDropdownSelection}
          title={(this.state.currentSelectionFunc && this.state.currentSelectionFunc.name) || 'Select a Selection Algorithm'}
          key={1}
          id="selection-algorithm-dropdown"
        >
          {this.state.selectionFuncs.map((func, idx) =>
            <MenuItem key={func.id} eventKey={idx}>{func.name}</MenuItem>
          )}
        </DropdownButton>
        <DropdownButton
          onSelect={this.handleMutationDropdownSelection}
          title={(this.state.currentMutationFunc && this.state.currentMutationFunc.name) || 'Select a Mutation Algorithm'}
          key={2}
          id="mutations-algorithm-dropdown"
        >
          {this.state.mutationFuncs.map((func, idx) =>
            <MenuItem key={func.id} eventKey={idx}>{func.name}</MenuItem>
          )}
        </DropdownButton>
        <Slider style={{ width: 200 }}defaultValue={1} />
        <CodeEditor />
      </div>
    )
  }
}

export default AlgorithmInputs
