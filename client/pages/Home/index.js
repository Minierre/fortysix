import React from 'react'
import {
  Jumbotron,
  Button
} from 'react-bootstrap'

const Home = () => (
  <Jumbotron>
    <div id="particle" className="particle-background"></div>
    <h1>FortySix</h1>
    <p>
      Run Genetic Algorithms with your friends on
      each of your computers.
  </p>
    <p>
      <Button bsStyle="primary">Sign up</Button>
    </p>
  </Jumbotron>
)

export default Home
