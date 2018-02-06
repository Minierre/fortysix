import React from 'react'
import { Link } from 'react-router-dom'
import {
  Navbar,
  MenuItem,
  Nav,
  NavItem,
  NavDropdown
} from 'react-bootstrap'

import './style.css'

const NavigationBar = () => (
  <Navbar inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">FortySix</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav pullRight>
        <NavItem eventKey={1} href="#">
          Rooms
        </NavItem>
        <NavItem eventKey={2} href="#">
          Login
        </NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default NavigationBar
