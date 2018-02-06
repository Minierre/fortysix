import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Button, Form } from 'react-bootstrap'
import history from '../../history'


class CreateRoom extends Component {
  constructor(props) {
    super(props)
    this.state = { roomName: '', rooms: [], ownedRooms: [] }
    this.handleChange = this.handleChange.bind(this)
    this.createRoom = this.createRoom.bind(this)
  }

  componentDidMount() {
    axios.get('/api/room/all')
      .then(res => res.data)
      .then((rooms) => {
        this.setState({ rooms })
      })

    if (this.props.isLoggedIn) {
      axios.get(`/api/users/${this.props.userId}/rooms`)
      .then(res => res.data)
      .then((ownedRooms) => {
        this.setState({ ownedRooms })
      })
    }
  }

  createRoom(e) {
    e.preventDefault()
    axios.post('/api/room', { roomName: this.state.roomName })
      .then(res => history.push(`/admin/${res.data.roomHash}`))
  }

  handleChange(e) {
    this.setState({ roomName: e.target.value })
  }

  render() {
    const { rooms, ownedRooms } = this.state
    return (
      <div>
        { this.props.isLoggedIn &&
            <Form>
              <div className="form-group">
                <label htmlFor="createRoom">Enter Room Name</label>
                <input type="text" onChange={this.handleChange} className="form-control" id="roomName" placeholder="Room Name" />
              </div>
              <div>
                <Button type="submit" className="btn btn-primary" onClick={this.createRoom}>Create Room</Button>
              </div>
            </Form> }
        <div>
          <h4>Your Rooms</h4>
          <ul className="list-group">
            {ownedRooms.map(room => <li className="list-group-item" key={room.roomName}><Link to={`/admin/${room.roomHash}`}>{room.roomName}</Link></li>)}
          </ul>
        </div>

        <div>
          <h4>Join an Existing Room</h4>
          <ul className="list-group">
            {rooms.map(room => <li className="list-group-item" key={room.roomName}><Link to={`/contributor/${room.roomHash}`}>{room.roomName}</Link></li>)}
          </ul>
        </div>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    userId: state.user.id,
    isLoggedIn: !!state.user.email
  }
}


export default connect(mapState)(CreateRoom)
