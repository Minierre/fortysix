const {
  generateRandomNumbers,
  sumRandomNumbers
} = require('../modules/randomLargeSum')

const rooms = {}

module.exports = (io) => {

  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('join', (room) => {
      if (!rooms[room]) rooms[room] = 0
      ++rooms[room]
      socket.once('disconnect', () => {
        --rooms[room]
        io.sockets.emit('updateCount-' + room, rooms[room])
      })
      io.sockets.emit('updateCount-'+room, rooms[room])
    })

    socket.on('leave', (room) => {
      --rooms[room]
      console.log(rooms[room])
      socket.leave(room)
      io.sockets.emit('updateCount-'+room, rooms[room])
    })

    socket.on('requestRoomCount', (room) => {
      socket.emit('getRoomCount-'+room, rooms[room])
    })

    socket.on('startHugeSum', () => {
      Object.keys(io.sockets.sockets).forEach((id) => {
        io.sockets.sockets[id].emit('callHugeSum', 13)
      })
    })

    socket.on('result', (result) => {
      console.log('result: ', result)
    })
  })
}
