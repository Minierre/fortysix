function partition(io, room, graph) {
  const partitions = {}
  const callName = 'CALL_' + room
  const socketsInRoom = io.sockets.adapter.rooms[room].sockets
  const parts = Object.keys(socketsInRoom).length

  Object.keys(graph).forEach((v, i) => {
    if (partitions[(i + 1) % parts]) partitions[(i + 1) % parts].push(v)
    else partitions[(i + 1) % parts] = [v]
  })

  Object.keys(socketsInRoom).forEach((id, i) => {
    io.sockets.sockets[id]
      .emit(callName, partitions[i], graph)
  })
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
