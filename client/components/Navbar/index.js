import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Navbar as NavigationBar, Button } from 'react-bootstrap'
import history from '../../history'


const axios = require('axios')

import './style.css'

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.logout = this.logout.bind(this)
  }

logout(evt) {
  axios.post('api/auth/logout')
  .then(() => history.push('/login'))
}

  render() {
    console.log(this.props);
    return(
      <NavigationBar inverse>
      <NavigationBar.Header>
      <NavigationBar.Brand>
        <Link to="/">FortySix</Link>
      </NavigationBar.Brand>
      </NavigationBar.Header>
        <ul className="nav navbar-nav navbar-right">
          <li onClick={this.logout}><a href='/'><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
        </ul>
      </NavigationBar>
    )
  }
}


export default Navbar
