import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../../store'
import {
  Navbar,
  Nav,
  NavItem,
} from 'react-bootstrap'

import './style.css'

const NavigationBar = (props) => {
  const logInOrOut = props.isLoggedIn ? 'logout' : 'login'
  return (
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
          <LinkContainer to={logInOrOut}>
            {props.isLoggedIn ?
              <NavItem onClick={props.onLogout}>Logout</NavItem> :
              <NavItem>Login</NavItem>}
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
  }
}

const mapDispatch = (dispatch) => {
  return {
    onLogout(evt) {
      evt.preventDefault()
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(NavigationBar)
