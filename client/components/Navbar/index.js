import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import {
  Navbar,
  Nav,
  NavItem,
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
        <LinkContainer to="/rooms">
          <NavItem>
            Rooms
          </NavItem>
        </LinkContainer>
        <LinkContainer to="/asds">
          <NavItem>
            Top Contributors
          </NavItem>
        </LinkContainer>
        <LinkContainer to="/login">
          <NavItem>
            Login
          </NavItem>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default NavigationBar
