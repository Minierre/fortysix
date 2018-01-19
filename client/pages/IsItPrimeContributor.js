import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { Route, Switch, Router } from 'react-router-dom'
import history from './history'

import {
  Navbar,
  StatusBulbs,
  RuntimeLabel,
  ConsoleOutput
} from './components'
import './style.css'

class IsItPrimeContributor extends Component {

  componentDidMount() {
    this.props.socket.on('callFunction', (times) => {
      for (let i = 0; i < times; ++i) {
        this.props.socket.emit('result', this.sumRandomNumbers(times))
      }
    })
  }

  onClick(evt) {
    this.props.socket.emit('start')
  }

  generateRandomNumbers() {
    const min = -10
    const max = 10
    let list = new Array(10000000)
    for (let i = 0; i < 10000000; ++i) {
      list[i] = Math.random() * (max - min) + min
    }
    return list
  }

  sumRandomNumbers(times) {
    let num = 0
    const listnums = this.generateRandomNumbers()
    for (let i = 0; i < listnums.length; ++i) {
      num += listnums[i]
    }
    return num
  }

  render() {
    return (
      <div id="app-wrapper">
        <Navbar />
        <div id="content-wrapper">
          <div className="algo-name-header-wrapper">
            <h2>Is It Prime?</h2>
          </div>
          <div className="toolbar-wrapper">
            <Button
              bsStyle="primary"
              onClick={this.onClick.bind(this)}
            >Run Job</Button>
          </div>
          <StatusBulbs />
          <RuntimeLabel />
          <ConsoleOutput />
        </div>
      </div>
    )
  }
}


export default IsItPrimeContributor
