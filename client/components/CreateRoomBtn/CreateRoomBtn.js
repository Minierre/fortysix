import React from 'react'
import history from '../../history'
const crypto = require('crypto');

import axios from 'axios'

import {
  Button
} from 'react-bootstrap'


// need a better way to create hashes but this will do for now
function createHash() {
  const secret = (Math.random() * Math.random() * 10000000000).toString();
  const hash = crypto.createHmac('sha256', secret)
  return hash;
}

function createRoom() {
  const hash = createHash()
  axios.post('/api/room', { roomName: 'testRoom', roomHash: hash })
    .then(res => console.log(res.data))
    .then(history.push('/hi'))
}

const CreateRoomBtn = () => (
  <div>
    <Button onClick={createRoom}>Create Room</Button>
  </div>
)

export default CreateRoomBtn
