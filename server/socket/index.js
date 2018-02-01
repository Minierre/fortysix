const chalk = require('chalk')
const {
  History,
  Room,
  Selections,
  Parameters,
  Mutations
} = require('../db/models')
const { RoomManager } = require('../utils/room')

const rooms = {}

const getRoom = (object = {}) => {
  return object || {}
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    registerJoinAdmin(socket, io)
    registerEvents(socket, io)
  })
}

function registerJoinAdmin(socket, io) {
  socket.on('ADMIN_JOIN', (room) => {
    if (!rooms[room]) rooms[room] = new RoomManager(room, socket)
    rooms[room].addAdmin(socket)
    registerJobStart(
      room,
      socket,
      io
    )
  })
}

// todo: register leave admin

function registerJobStart(room, socket, io) {
  const startName = 'START_' + room
  socket.on(startName, (args) => {
    if (!rooms[room]) throw new Error(chalk.red(`${room} doesn't exist!`))
    rooms[room].jobInit(socket, io, args)
  })
}

function registerEvents(socket, io) {
  registerJoin(socket, io)
  registerLeave(socket, io)
  registerStart(socket, io)
  registerDone(socket, io)
  registerRequestRoom(socket, io)
  registerAbort(socket, io)
  registerJobError(socket, io)
}

// when a specific client gets an error
function registerJobError(socket, io) {
  socket.on('JOB_ERROR', ({ roomHash, error }) => {
    rooms[roomHash].jobError(socket, io, error)
  })
}

// abort event gets triggered when when the client side reset button is hit
function registerAbort(socket) {
  socket.on('ABORT', room => rooms[room].abort(socket))
}

// when a contributor enters a room, a new in memory room is created (or an existing in memory room is updated with a new node)
function registerJoin(socket, io) {
  socket.on('join', (room) => {
    if (!rooms[room]) rooms[room] = new RoomManager(room, socket)
    rooms[room].join(socket, io)
    // if a socket disconnects, we take that node off the room's list of nodes
    socket.once('disconnect', () => rooms[room].leave(socket, io))
  })
}

function registerRequestRoom(socket) {
  socket.on('REQUEST_ROOM', (room) => {
    socket.emit('UPDATE_' + room, { nodes: getRoom(rooms[room]).nodes })
  })
}

function registerLeave(socket, io) {
  socket.on('leave', room => rooms[room].leave(socket, io))
}

function registerStart(socket) {
  socket.on('start', (room) => {
    console.log(chalk.green('STARTING: '), socket.id, room)
  })
}

// When a client finishes its work, it calls 'done' socket event
function registerDone(socket, io) {
  socket.on('done', finishedTask => doneCallback(finishedTask, socket, io))
}

function doneCallback(finishedTask, socket, io) {
  // a bit of a security check --  might signal a malicious behavior
  if (finishedTask.fitnesses && finishedTask.fitnesses.length < 1) throw Error()
  // update the room state
  rooms[finishedTask.room].updateRoomStats(finishedTask)
  // update the bucket
  rooms[finishedTask.room].updateBucket(finishedTask)
  // checks if termination conditions are met and acts accordingly
  rooms[finishedTask.room].terminateOrDistribute(finishedTask, socket, io)
  console.log(chalk.green('DONE: '), socket.id, finishedTask.room)
}
