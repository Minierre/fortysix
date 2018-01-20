const chalk = require('chalk')

const {
  generateRandomNumbers,
  sumRandomNumbers
} = require('../modules/randomLargeSum')

const travellingSalesman = require('../modules/travellingSalesman')

// constants for job names
const HUGE_SUM = 'HUGE_SUM'
const START_HUGE_SUM = 'START_HUGE_SUM'
const GET_ROOM_COUNT_HUGE_SUM = 'GET_ROOM_COUNT_HUGE_SUM'
const REQUEST_ROOM_COUNT = 'REQUEST_ROOM_COUNT'
const TRAVELLING_SALESMAN = 'TRAVELLING_SALESMAN'

const rooms = {}

const getNodesLength = (object = {}) => {
  return object.nodes ? Object.keys(object.nodes).length : 0
}

module.exports = (io) => {

  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    // General purpose
    socket.on('join', (room) => {
      socket.join(room)
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

      // General purpose
      socket.once('disconnect', () => {
        delete rooms[room].nodes[socket.id]
        socket.leave(room)
        io.sockets.emit('UPDATE_COUNT_' + room, getNodesLength(rooms[room]))
      })
      io.sockets.emit('UPDATE_COUNT_' + room, getNodesLength(rooms[room]))
    })

    // General purpose
    socket.on('leave', (room) => {
      socket.leave(room)
      delete rooms[room].nodes[socket.id]
      io.sockets.emit('UPDATE_COUNT_' + room, getNodesLength(rooms[room]))
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

    socket.on('REQUEST_ROOM_COUNT', (room) => {
      socket.emit('GET_ROOM_COUNT_' + room, getNodesLength(rooms[room]))
    })

    jobInit(HUGE_SUM, socket, io, (io, room) => {
      const socketsInRoom = io.sockets.adapter.rooms[HUGE_SUM].sockets
      Object.keys(socketsInRoom).forEach((id) => {
        io.sockets.sockets[id].emit('CALL_' + room, 13)
      })
    })

    jobInit(TRAVELLING_SALESMAN, socket, io, travellingSalesman.partition)

    socket.on('result', (result) => {
      console.log('result: ', result)
    })
  })
}


function jobInit(room, socket, io, partition) {
  const startName = 'START_' + room

  socket.on(startName, (args) => {
    rooms[room].start = Date.now()

    Object.keys(rooms[room].nodes).forEach((socketId) => {
      rooms[room].nodes[socketId].running = true
    })

    if (rooms[room]) {
      if (!rooms[room].running) {
        rooms[room].running = true
        partition(io, room, args)
        rooms[room].running = false
      } else {
        console.log(chalk.red(`${startName} already running!`))
      }
    } else {
      console.log(chalk.red(`${startName} attempted without nodes`))
    }
  })
}
