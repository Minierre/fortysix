import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

import {
  StatusBulbs,
  RuntimeLabel,
  ConsoleOutput,
} from '../components'


class RandomLargeSum extends Component {

  onClick(evt) {
    this.props.socket.emit('start')
  }

  render() {
    return (
      <div>
        <div className="algo-name-header-wrapper">
          <h2>Accumlated Large Sum Demo</h2>
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
      </div >
    )
  }
}

export default RandomLargeSum

