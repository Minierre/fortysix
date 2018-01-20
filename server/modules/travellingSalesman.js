function partition(graph, parts) {
  partitions = {}
  Object.keys(graph).forEach((v, i) => {
    if (partitions[(i + 1) % parts]) partitions[(i + 1) % parts].push(v)
    else partitions[(i + 1) % parts] = [v]
  })
  return partitions
}

function delegate(starts, graph) {
}

function execute() {}

function congregate() {

}

module.exports = {
  partition,
  delegate,
  congregate
}
