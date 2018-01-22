import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'
import { spawn } from 'threads'
import './style.css'

const TRAVELLING_SALESMAN = 'TRAVELLING_SALESMAN'
const LEAVE_TRAVELLING_SALESMAN = 'LEAVE_TRAVELLING_SALESMAN'
const CALL_TRAVELLING_SALESMAN = 'CALL_TRAVELLING_SALESMAN'

class TravellingSalesmanContributor extends Component {

  componentDidMount() {
    this.props.socket.emit('join', TRAVELLING_SALESMAN)
    this.props.socket.on(CALL_TRAVELLING_SALESMAN, (parts, graph, { multiThreaded }) => {
      this.props.socket.emit('start', TRAVELLING_SALESMAN)
      try {
        console.log(parts, graph, 'multiThreaded: ' + multiThreaded)
        if (multiThreaded) {
          this.runMultiThreaded(parts, graph)
        } else {
          this.runSingleThreaded(parts, graph)
        }
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

  runSingleThreaded(part, graph) {
    this.props.socket.emit('done', {
      room: TRAVELLING_SALESMAN,
      id: part.id,
      graph,
      result: this.shortestPathSingleThreaded(part.value, graph)
    })
  }

  shortestPathSingleThreaded(start, graph) {
    let shortest = ['', Infinity]
    let nodes = Object.keys(graph).reduce((a, b) => {
      if (!start.includes(b)) a += b
      return a
    }, '')
    let s = this.permutations(nodes, start, graph)
    if (s[1] < shortest[1]) shortest = s
    return shortest
  }

  permutations(str, start, g) {
    let bestP = ['', Infinity]
    const perm = (substr, p = '') => {
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

  runMultiThreaded(parts, graph) {
    let shortest = ['', Infinity]
    let i = 0
    this.shortestPath(parts.value, graph, (s) => {
      if (s[1] < shortest[1]) shortest = s
      ++i
      if (i === parts.value.length) {
        this.props.socket.emit('done', {
          room: TRAVELLING_SALESMAN,
          id: parts.id,
          result: shortest,
          graph,
          multiThreaded: true
        })
      }
    })
  }

  shortestPath(starts, graph, done) {
    for (var i = 0; i < starts.length; i++) {
      let nodes = Object.keys(graph).reduce((a, b) => {
        if (!starts[i].includes(b)) a += b
        return a
      }, '')

      const thread = spawn((args, done) => {

        function permutations(str, start, g) {
          let bestP = ['', Infinity];
          const perm = (substr, p = '') => {
            if (substr === '' && permdist(start + p + start[0], g) < bestP[1]) {
              bestP = [start + p + start[0], permdist(start + p + start[0], g)];
            } else {
              for (var i = 0; i < substr.length; i++) {
                perm(substr.slice(0, i) + substr.slice(i + 1), p + substr[i]);
              }
            }
          }
            perm(str);

          return bestP;
        }

        function permdist(p, g) {
          let d = 0;
          for (var i = 0; i < p.length - 1; i++) {
            d += g[p[i]][p[i + 1]];
          }
          return d;
        }

        done({ result: permutations(args.nodes, args.start, args.graph) })
      })

      thread
        .send({ start: starts[i], graph, nodes })
        .on('message', (s) => {
          done(s.result)
          thread.kill()
        })
        .on('error', (error) => {
          this.props.socket.emit('JOB_ERROR', TRAVELLING_SALESMAN)
          console.error('Worker errored:', error)
        })
    }
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
