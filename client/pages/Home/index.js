import React, { Component } from 'react'
import {
  Button
} from 'react-bootstrap'
import times from 'lodash/times'
import { LinkContainer } from 'react-router-bootstrap'
import particlesConfig from './particles.config'
import './style.css'


const roomMetaData = [
  {
    photo: 'images/hello-world.png',
    title: 'Hello World',
    description: 'Help an algorithm write code that compiles.'
  },
  {
    photo: 'images/markus-spiske-445253.jpg',
    title: 'String Matcher',
    description: 'Help an algorithm match a given string.'
  },
  {
    photo: 'images/game-of-life.png',
    title: 'Game of Life',
    description: 'Find the best starting position for Game of Life.'
  },
  {
    photo: 'images/game-of-life-2.png',
    title: 'GoL Looper',
    description: 'Find the best starting position to loop Game of Life.'
  }
]


class Home extends Component {
  componentDidMount() {
    // Global function
    // FIXME: modularize
    particlesJS('particle', particlesConfig)
  }

  render() {
    return (
      <div>
        <div id="particle" className="particle-background"></div>
        <div id="heading">
          <h1>FortySix</h1>
          <small>
            Run Genetic Algorithms with your friends on
            each of your computers.
          </small>
          <p>
            <LinkContainer to="/signup">
              <Button bsSize="large" bsStyle="primary">Sign up</Button>
            </LinkContainer>
          </p>
        </div>
        <div id="algorithm-rooms">
          <h2>Top Algorithms</h2>
          <div className="row text-center">
            {
              times(4, i => (
                <div className="col-md-3 col-sm-6 hero-feature">
                  <div className="thumbnail">
                    <img src={roomMetaData[i].photo} alt="" />
                    <div className="caption">
                      <h3>{roomMetaData[i].title}</h3>
                      <p>{roomMetaData[i].description}</p>
                      <p>
                        <a href="#" className="btn btn-primary">Join!</a>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Home
