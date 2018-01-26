import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Router } from 'react-router-dom'
import history from './history'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {
  Navbar,
  Main,
} from './components'

import {
  RandomLargeSum,
  RandomLargeSumContributor,
  TravellingSalesman,
  TravellingSalesmanContributor,
  Home
} from './pages'

import './style.css'

class App extends Component {
  render() {
    return (
      <div id="app-wrapper">
        <MuiThemeProvider>
          <div>
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
                  <Route
                    path="/admin/travelling-salesman"
                    component={() => <TravellingSalesman socket={this.props.socket} />}
                  />
                  <Route
                    path="/travelling-salesman"
                    component={() => <TravellingSalesmanContributor socket={this.props.socket} />}
                  />
                  <Route
                    path="/"
                    component={() => <Home socket={this.props.socket} />}
                  />
                </Switch>
              </Main>
            </Router >
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

App.propTypes = {}

export default App
