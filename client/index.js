import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
import '../public/style.css'

// establishes socket connection
import socket from './socket'

ReactDOM.render(
  <Provider store={store}>
    <App socket={socket} />
  </Provider>,
  document.getElementById('app')
)
