import React, { Component } from 'react'
import times from 'lodash/times'
import './style.css'
import map from 'lodash/map'
import ReactLoading from 'react-loading';

import axios from 'axios'

class TravelingSalesmanAdminInputs extends Component {
  constructor() {
    super();
    this.state = { fitnessFunc: {},
      currentSelectionFunc: {},
      currentMutationFunc: {},
      selectionFuncs: [],
      mutationFuncs: []
    }
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

  render() {
    console.log(this.state)
    return (
      <div>
        <h1>Test</h1>
      </div>
    )
  }
}

export default TravelingSalesmanAdminInputs
