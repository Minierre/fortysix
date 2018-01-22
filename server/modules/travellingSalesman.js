const uuid = require('uuid/v1')

function partition(io, room, graph, done) {
  const socketsInRoom = io.sockets.adapter.rooms[room].sockets
  const parts = Object.keys(socketsInRoom).length

  const keys = Object.keys(graph)
  let portions = ['']
  while (parts*4 >= portions.length) {
    portions = portions.reduce((a, b) => {
      keys.forEach(v => {
        if (!b.includes(v)) a.push(b.concat(v))
      })
      return a
    }, [])
  }
  done(portions.map(value => ({ id: uuid(), value: [value] })))
  // this needs to be way better
  // portions.forEach((v, i) => {
  //   if (partitions[(i + 1) % parts]) partitions[(i + 1) % parts].push(v)
  //   else partitions[(i + 1) % parts] = [v]
  // })

  // Object.keys(socketsInRoom).forEach((id, i) => {
  //   io.sockets.sockets[id]
  //     .emit(callName, partitions[i], graph, { multiThreaded })
  // })
}

function delegate(starts, graph) {
}

function execute() { }

function congregate() {

}

module.exports = {
  partition,
  delegate,
  congregate
}
