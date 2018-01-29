import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import history from '../../history'

const LoginSignupBtn = () => (
  <div>
    <Button type="submit" className="btn btn-primary" onClick={() => history.push('/login')}>Login</Button>
  </div>
);

export default LoginSignupBtn;
