import React, { Component } from 'react'
import { Form, FormGroup, Col, FormControl, Checkbox, ControlLabel, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { auth } from '../store'

class LoginSignup extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' }
  }

  handleTextChange(e) {
    console.log(e.target.value)
  }

  render() {
    return (
      <div>
        <Form horizontal>
          <h2>Login</h2>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={2}>
              Email
            </Col>
            <Col sm={3}>
              <FormControl type="email" placeholder="Email" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} sm={2}>
              Password
            </Col>
            <Col sm={3}>
              <FormControl type="password" placeholder="Password" />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Checkbox>Remember me</Checkbox>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button bsStyle="primary" type="submit">Sign in</Button>
              <span> or </span>
              <Button bsStyle="primary">Sign Up</Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    )
  }
}

const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(LoginSignup)
export const Signup = connect(mapSignup, mapDispatch)(LoginSignup)
