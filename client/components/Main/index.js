import React from 'react'
import PropTypes from 'prop-types'
import { Navbar } from '../'

import './style.css'

const Main = ({ children }) => (
  <div>
    <Navbar />
    <div className="container">
      {children}
    </div>
  </div>
)

export default Main
