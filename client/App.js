import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Router } from 'react-router-dom'
import history from './history'

import {
  Navbar,
  Main
} from './components'

import {
  RandomLargeSum,
  RandomLargeSumContributor
} from './pages'

import './style.css'

class App extends Component {

  render() {
    return (
      <div id="app-wrapper">
        <Navbar />
        <Router history={history}>
          <Main>
            <Switch>
              <Route
                path="/admin/random-large-sum"
                component={() => <RandomLargeSum socket={this.props.socket} />}
              />
              <Route
                path="/random-large-sum"
                component={() => <RandomLargeSumContributor socket={this.props.socket} />}
              />
            </Switch>
          </Main>
        </Router >
      </div>
    )
  }
}

App.propTypes = {}

export default App
