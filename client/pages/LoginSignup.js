import React, { Component } from 'react'
import { Form, FormGroup, Col, FormControl, Checkbox, ControlLabel, Button } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { auth } from '../store'

class Auth extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const method = this.props.location.pathname.slice(1).toLowerCase()
    const isSigningIn = method === "login"

    return (
      <div>
        <Form horizontal onSubmit={e => this.props.handleSubmit.call(this, e, method)}>
          <h2>{isSigningIn ? 'Login' : 'Sign Up'}</h2>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={2}>
              Email
            </Col>
            <Col sm={3}>
              <FormControl name="email" type="email" placeholder="Email" />
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
              <Button
                bsStyle="primary"
                type="submit"
              >{isSigningIn ? 'Login' : 'Sign Up'}
              </Button>
              <span>{isSigningIn ? '   Don\'t have an account yet?' : '   Already have an account?'}</span>
              <span>{isSigningIn ?
                <a href="/signup"> Sign Up</a> :
                <a href="/login"> Login</a>}
              </span>
            </Col>
          </FormGroup>
        </Form>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    error: state.user.error
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt, method) {
      evt.preventDefault()
      const email = evt.target.formHorizontalEmail.value
      const password = evt.target.formHorizontalPassword.value
      dispatch(auth(email, password, method))
    }
  }
}

export const LoginSignup = withRouter(connect(mapState, mapDispatch)(Auth))
