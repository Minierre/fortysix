import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar as NavigationBar } from 'react-bootstrap'

import './style.css'

const Navbar = () => (
  <NavigationBar inverse>
    <NavigationBar.Header>
      <NavigationBar.Brand>
        <Link to="/">FortySix</Link>
      </NavigationBar.Brand>
    </NavigationBar.Header>
  </NavigationBar>
)

export default Navbar
