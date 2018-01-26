const uuid = require('uuid/v1')
// Generate task objects based on parameters input

function generateTasks({ params }, room, nodes) {

  // call DB for functions via id's

  const tasks = []




  for (let i = 0; i < 4 * Object.keys(nodes).length; i++) {
    const task = {
      room,
      id: uuid(),
      gen: 1,
      population: genPop(params.chromosomeLength, params.population),
      fitness: {},
      mutations: [],
      selection: {}
    }
    tasks.push(task)
  }
  return tasks
}

function genPop(l, s) {
  const pop = []
  for (let i = 0; i < s; i++) {
    const c = (parseInt(Math.pow(2, l - 1) * Math.random())).toString(2)
    pop.push(('0').repeat(l - c.length) + c)
  }
  return pop
}

// , ((portions) => {
//   rooms[room].tasks = (rooms[room].multiThreaded) ?
//     portions.reduce((a, b, i) => {
//       if (a[Math.floor(i / 4)]) a[Math.floor(i / 4)].value.push(b.value[0])
//       else a[Math.floor(i / 4)] = b
//       return a
//     }, []) :
//     portions.map(v => ({
//       id: v.id,
//       value: v.value[0]
//     }))

module.exports = { generateTasks }
