import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'

class RandomLargeSumContributor extends Component {

  componentDidMount() {
    this.props.socket.emit('join', 'hugeSum')
    this.props.socket.on('callHugeSum', (times) => {
      this.props.socket.emit('start', 'hugeSum')
      for (let i = 0; i < times; ++i) {
        this.props.socket.emit('result', this.sumRandomNumbers(times))
      }
      this.props.socket.emit('done', 'hugeSum')
    })
  }

  componentWillUnmount() {
    this.props.socket.emit('leaveHugeSum')
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

RandomLargeSumContributor.propTypes = {}

export default RandomLargeSumContributor
