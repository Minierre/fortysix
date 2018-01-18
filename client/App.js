import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import debounce from 'lodash/debounce'

const imageURL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg'

class App extends Component {

  onChange(evt) {
    this.props.socket.emit('update', { value: evt.target.value })
  }

  render() {
    return (
      <div>
        <img style={{ height: '250px' }} alt="ad" src={imageURL} />
        <input onChange={this.onChange.bind(this)} />
      </div>
    )
  }
}

App.propTypes = {}

export default App
