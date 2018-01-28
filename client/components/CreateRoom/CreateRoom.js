import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Button, Form } from 'react-bootstrap'
import history from '../../history'

const crypto = require('crypto')

// need a better way to create hashes but this will do for now
function createHash() {
  const secret = (Math.random() * Math.random() * 10000000000).toString();
  const hash = crypto.createHmac('sha256', secret)
    .update('ExtraSecret')
    .digest('hex')
  return hash
}


class CreateRoom extends Component {
  constructor() {
    super()
    this.state = { roomName: '', rooms: [] }
    this.handleChange = this.handleChange.bind(this)
    this.createRoom = this.createRoom.bind(this)
  }

  componentWillMount() {
    axios.get('/api/room')
    .then(res => res.data)
    .then(rooms => {
      this.setState({rooms});
    })
    .catch()
  }

  createRoom() {
    const hash = createHash()
    console.log(this.state)
    axios.post('/api/room', { roomName: this.state.roomName, roomHash: hash })
    .then(res => history.push(`/admin/${res.data.roomHash}`))
    console.log(this.state);
    console.log(hash);
  }

  handleChange(e) {
    this.setState({roomName: e.target.value})
  }

  render() {
    const rooms = this.state.rooms
    return (
      <div>
        <Form>
          <div className="form-group">
            <label htmlFor="createRoom">Enter Room Name</label>
            <input type="text" onChange={this.handleChange} className="form-control" id="roomName" placeholder="Room Name"></input>
          </div>
        </Form>
        <div>
          <Button className='btn btn-primary' onClick={this.createRoom}>Create Room</Button>
        </div>
        <div>
        <h4>Join an Existing Room</h4>
        <ul className="list-group">
        {rooms.map(room => <li className="list-group-item" key={room.roomName}><Link to={`/contributor/${room.roomHash}`}>{room.roomName}</Link></li>)}</ul>
        </div>
        <div>
        <h4>Join an Existing Room as an Admin</h4>
        <ul className="list-group">
        {rooms.map(room => <li className="list-group-item" key={room.roomName}><Link to={`/admin/${room.roomHash}`}>{room.roomName}</Link></li>)}</ul>
        </div>
        </div>
    )
  }
}


export default CreateRoom
