import React from 'react'
import { Navbar as NavigationBar } from 'react-bootstrap'

import './style.css'

const Navbar = () => (
  <NavigationBar inverse>
    <NavigationBar.Header>
      <NavigationBar.Brand>
        Forty Six
      </NavigationBar.Brand>
    </NavigationBar.Header>
    <p className="navbar-text navbar-right">Signed in as </p>
  </NavigationBar>
)

export default Navbar
