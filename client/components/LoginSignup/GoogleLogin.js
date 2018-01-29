import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import history from '../../history'

const wellStyles = { maxWidth: 400, margin: '0 auto 10px' };


const GoogleLogin = () => (
  <div className="well" style={wellStyles}>
    <Button onClick={console.log} bsStyle="primary" bsSize="large" block>
      Login With Google
    </Button>
  </div>
);

export default GoogleLogin;
