function partition(io, callName, graph) {
  const partitions = {}
  const parts = Object.keys(io.sockets.sockets).length
  console.log(io.sockets.sockets)
  Object.keys(graph).forEach((v, i) => {
    if (partitions[(i + 1) % parts]) partitions[(i + 1) % parts].push(v)
    else partitions[(i + 1) % parts] = [v]
  })

  Object.keys(io.sockets.sockets).forEach((id, i) => {
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
