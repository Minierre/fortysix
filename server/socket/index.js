const {
  generateRandomNumbers,
  sumRandomNumbers
} = require('../modules/randomLargeSum')

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)


    socket.on('result', (result) => {
      console.log('result: ', result)
    })

    // Congretad Huge Sum
    socket.on('start', () => {
      Object.keys(io.sockets.sockets).forEach(function (id) {
        io.sockets.sockets[id].emit('callFunction', 13)
      })
    })

    socket.on('result', (result) => {
      console.log('result: ', result)
    })
  })
}
