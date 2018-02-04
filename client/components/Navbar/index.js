import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Navbar as NavigationBar } from 'react-bootstrap'
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
  axios.post('/auth/logout')
  .then(() => history.push('/login'))
}

  render() {
    return(
      <NavigationBar inverse>
      <NavigationBar.Header>
      <NavigationBar.Brand>
      <Link to='/'>
      4D6
      </Link>
      </NavigationBar.Brand>
      </NavigationBar.Header>
      <button type='submit' className='btn' onClick={this.logout}>Logout</button>
      </NavigationBar>
    )
  }
}


export default Navbar
