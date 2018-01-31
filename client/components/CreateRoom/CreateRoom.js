import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Button, Form } from 'react-bootstrap'
import history from '../../history'


class CreateRoom extends Component {
  constructor() {
    super()
    this.state = { roomName: '', rooms: [] }
    this.handleChange = this.handleChange.bind(this)
    this.createRoom = this.createRoom.bind(this)
  }

  componentDidMount() {
    axios.get('/api/room/all')
      .then(res => res.data)
      .then((rooms) => {
        this.setState({ rooms })
      })
  }

  createRoom(e) {
    e.preventDefault()
    axios.post('/api/room', { roomName: this.state.roomName})
      .then(res => history.push(`/admin/${res.data.roomHash}`))
  }

  handleChange(e) {
    this.setState({ roomName: e.target.value })
  }

  render() {
    const rooms = this.state.rooms
    return (
      <div>
        <Form>
          <div className="form-group">
            <label htmlFor="createRoom">Enter Room Name</label>
            <input type="text" onChange={this.handleChange} className="form-control" id="roomName" placeholder="Room Name" />
          </div>
          <div>
            <Button type="submit" className="btn btn-primary" onClick={this.createRoom}>Create Room</Button>
          </div>
        </Form>
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
