import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'

const TRAVELLING_SALESMAN = 'TRAVELLING_SALESMAN'
const LEAVE_TRAVELLING_SALESMAN = 'LEAVE_TRAVELLING_SALESMAN'
const CALL_TRAVELLING_SALESMAN = 'CALL_TRAVELLING_SALESMAN'

class TravellingSalesmanContributor extends Component {

  componentDidMount() {
    this.props.socket.emit('join', TRAVELLING_SALESMAN)
    this.props.socket.on(CALL_TRAVELLING_SALESMAN, (parts, graph) => {
      this.props.socket.emit('start', TRAVELLING_SALESMAN)
      try {
        console.log(parts, graph)
        this.props.socket.emit('result', this.shortestPath(parts, graph))
        this.props.socket.emit('done', TRAVELLING_SALESMAN)
      } catch (err) {
        console.error(err)
        this.props.socket.emit('JOB_ERROR', TRAVELLING_SALESMAN)
      }
    })

    this.props.socket.on('disconnect', () => {
      this.props.socket.on('connect', () => {
        this.props.socket.emit('join', TRAVELLING_SALESMAN)
      })
    })
  }

  componentWillUnmount() {
    this.props.socket.emit(LEAVE_TRAVELLING_SALESMAN)
  }

  shortestPath(starts, graph) {
    let shortest = ['', Infinity]
    for (var i = 0; i < Object.keys(starts).length; i++) {
      let nodes = Object.keys(graph).filter(v => v !== starts[i]).join('')
      let s = this.permutations(nodes, starts[i], graph)
      if (s[1] < shortest[1]) shortest = s
    }
    return shortest
  }

  permutations(str, start, g) {
    let bestP = ['', Infinity];
    const perm = (substr, p='') => {
      if (substr === '' && this.permdist(start + p + start[0], g) < bestP[1]) {
        bestP = [start + p + start[0], this.permdist(start + p + start[0], g)];
      } else {
        for (var i = 0; i < substr.length; i++) {
          perm(substr.slice(0, i) + substr.slice(i + 1), p + substr[i]);
        }
      }
    }
    perm(str);

    return bestP;
  }

  permdist(p, g) {
    let d = 0;
    for (var i = 0; i < p.length - 1; i++) {
      d += g[p[i]][p[i + 1]];
    }
    return d;
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

TravellingSalesmanContributor.propTypes = {}

export default TravellingSalesmanContributor
