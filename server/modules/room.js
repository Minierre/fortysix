class Room {
  constuctor(roomName, sockets) {
    this.sockets = sockets
    this.roomName = roomName
    this.nodes = {}
    this.tasks = []
    this.jobRunning = false
    this.multiThreaded = false
    this.start = null
    this.lastResult = null
  }

  join(socket) {
    socket.join(this.roomName)
    this.nodes[socket.id] = { running: false, error: false }
  }
}

module.exports = Room
