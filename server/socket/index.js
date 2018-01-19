const {
  generateRandomNumbers,
  sumRandomNumbers
} = require('../modules/randomLargeSum')

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    // Congretad Huge Sum
    socket.on('start', () => {
      Object.keys(io.sockets.sockets).forEach(function (id) {
        io.sockets.sockets[id].emit('startHugeSum', 13)
      })
    })

    socket.on('result', (result) => {
      console.log('result: ', result)
    })
  })
}
