import React from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap'
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

function createRoom() {
  const hash = createHash()
  axios.post('/api/room', { roomName: hash, roomHash: hash })
    .then(res => history.push(`/admin/${res.data.roomHash}`))
}

const CreateRoomBtn = () => (
  <div>
    <Button onClick={createRoom}>Create Room</Button>
  </div>
)

export default CreateRoomBtn