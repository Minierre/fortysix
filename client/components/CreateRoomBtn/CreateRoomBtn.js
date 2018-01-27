import React from 'react'
import history from '../../history'
import axios from 'axios'
import {
  Button
} from 'react-bootstrap'
const crypto = require('crypto');

// need a better way to create hashes but this will do for now
function createHash() {
  const secret = (Math.random() * Math.random() * 10000000000).toString();
  const hash = crypto.createHmac('sha256', secret)
    .update('ExtraSecret')
    .digest('hex');
  return hash;
}

function createRoom() {
  const hash = createHash()
  axios.post('/api/room', { roomName: 'testRoom8', roomHash: hash })
    .then(res => history.push(`/${res.data.roomHash}`))
}

const CreateRoomBtn = () => (
  <div>
    <Button onClick={createRoom}>Create Room</Button>
  </div>
)

export default CreateRoomBtn
