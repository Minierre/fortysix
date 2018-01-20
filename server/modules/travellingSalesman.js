function partition(io, room, graph) {
  const partitions = {}
  const callName = 'CALL_' + room
  const socketsInRoom = io.sockets.adapter.rooms[room].sockets
  const parts = Object.keys(socketsInRoom).length

  let keys = Object.keys(graph)
  let portions = ['']
  while(parts>=portions.length){
    portions = portions.reduce((a,b)=>{
      keys.forEach(v=>{
        if(!b.includes(v)) a.push(b.concat(v))
      })
      return a
    },[])
  }

  // this needs to be way better
  portions.forEach((v, i) => {
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
