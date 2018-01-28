const uuid = require('uuid/v1')

function generateTasks(
  populationSize,
  room,
  numTasks,
  fitness,
  mutations,
  selection,
  chromosomeLength
) {
  const tasks = []

  for (let i = 0; i < numTasks; i++) {
    const task = {
      room,
      id: uuid(),
      gen: 1,
      population: genPop(chromosomeLength, populationSize),
      fitness,
      mutations: [mutations],
      selection,
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

module.exports = { generateTasks }
