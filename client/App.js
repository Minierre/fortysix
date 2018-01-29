import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Router } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import history from './history'

import {
  Navbar,
  Main,
} from './components'

import {
  ScientistView,
  ContributorView,
  Home,
  LoginSignup
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
                    path="/admin/:roomHash"
                    component={() => <ScientistView socket={this.props.socket} />}
                  />
                  <Route
                    path="/contributor/:roomHash"
                    component={() => <ContributorView socket={this.props.socket} />}
                  />
                  <Route
                    path="/login"
                    component={() => <LoginSignup socket={this.props.socket} />}
                  />
                  <Route
                    path="/signup"
                    component={() => <LoginSignup socket={this.props.socket} />}
                  />
                  <Route
                    path="/"
                    component={() => <Home socket={this.props.socket} />}
                  />
                </Switch>
              </Main>
            </Router>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

App.propTypes = {}

export default App
