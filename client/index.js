import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import '../public/style.css'

// establishes socket connection
import socket from './socket'

ReactDOM.render( <App socket={socket} />, document.getElementById('app'))
