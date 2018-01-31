import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Router } from 'react-router-dom'
import history from './history'
import { me } from './store'

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
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    return (
      <div id="app-wrapper">
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
      </div>
    )
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

export default connect(null, mapDispatch)(App)

