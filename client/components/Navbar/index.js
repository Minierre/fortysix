import React from 'react'
import { Navbar as NavigationBar } from 'react-bootstrap'

import './style.css'

const Navbar = () => (
  <NavigationBar inverse>
    <NavigationBar.Header>
      <NavigationBar.Brand>
        Partonia
      </NavigationBar.Brand>
    </NavigationBar.Header>
  </NavigationBar>
)

export default Navbar
