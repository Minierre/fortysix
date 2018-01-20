const chalk = require('chalk')

const {
  generateRandomNumbers,
  sumRandomNumbers
} = require('../modules/randomLargeSum')

const rooms = {}

const getNodesLength = (object = {}) => {
  return object.nodes ? Object.keys(object.nodes).length : 0
}

module.exports = (io) => {

  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('join', (room) => {
      if (!rooms[room]) {
        rooms[room] = {
          start: null,
          jobRunning: false,
          nodes: { [socket.id]: { running: false } }
        }
      } else {
        rooms[room] = {
          jobRunning: rooms[room].jobRunning,
          nodes: {
            ...rooms[room].nodes,
            [socket.id]: { running: false }
          }
        }
      }
      socket.once('disconnect', () => {
        delete rooms[room].nodes[socket.id]
        io.sockets.emit('updateCount-' + room, getNodesLength(rooms[room]))
      })
      io.sockets.emit('updateCount-' + room, getNodesLength(rooms[room]))
    })

    socket.on('leave', (room) => {
      delete rooms[room].nodes[socket.id]
      io.sockets.emit('updateCount-' + room, getNodesLength(rooms[room]))
    })

    socket.on('start', (room) => {
      console.log(chalk.green('starting: '), socket.id, room)
    })

    socket.on('done', (room) => {
      rooms[room].nodes[socket.id].running = false

      const allDone =
        Object.keys(rooms[room].nodes)
          .every(socketId => rooms[room].nodes[socketId].running === false)

      if (allDone) {
        console.log(
          chalk.green('DURATION OF START HUGE SUM: ', Date.now() - rooms[room].start)
        )
        rooms[room].start = null
      }

      console.log(chalk.green('done: '), socket.id, room)
    })

    socket.on('requestRoomCount', (room) => {
      socket.emit('getRoomCount-' + room, getNodesLength(rooms[room]))
    })

    socket.on('startHugeSum', () => {
      rooms.hugeSum.start = Date.now()

      Object.keys(rooms.hugeSum.nodes).forEach(socketId => {
        rooms.hugeSum.nodes[socketId].running = true
      })

      if (rooms.hugeSum) {
        if (!rooms.hugeSum.running) {
          rooms.hugeSum.running = true
          Object.keys(io.sockets.sockets).forEach((id) => {
            io.sockets.sockets[id].emit('callHugeSum', 13)
          })
          rooms.hugeSum.running = false
        } else {
          console.log(chalk.red('startHugeSum already running!'))
        }
      } else {
        console.log(chalk.red('startHugeSum attempted without nodes'))
      }
    })

    socket.on('result', (result) => {
      console.log('result: ', result)
    })
  })
}
