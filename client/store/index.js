import { createStore, combineReducers, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import freeze from 'redux-freeze'
import { composeWithDevTools } from 'redux-devtools-extension'
import user from './user'

export const reducer = combineReducers({ user })
const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware, freeze,
  createLogger({ collapsed: true })
))
const store = createStore(reducer, middleware)

export default store
export * from './user'
