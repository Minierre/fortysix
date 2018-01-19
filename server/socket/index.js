const {
  generateRandomNumbers,
  sumRandomNumbers
} = require('../modules/randomLargeSum')

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })

    socket.on('start', () => {
      io.emit('callFunction', 13)
    })

    socket.on('result', (result) => {
      console.log('result: ', result)
    })
  })
}
