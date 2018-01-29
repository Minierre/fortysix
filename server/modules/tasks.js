const uuid = require('uuid/v1')

function generateTasks(
  populationSize,
  room,
  numTasks,
  fitness,
  mutations,
  selection,
  chromosomeLength,
  elitism
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
      elitism
    }
    tasks.push(task)
  }
  return tasks
}

function genPop(length, populationSize, probability = 0.5) {
  const pop = []
  for (let i = 0; i < populationSize; i++) {
    let c = ''
    for (let j = 0; j < length; j++) {
      // Randomly generate binary string
      c += (Math.random() > probability) ? '1' : '0'
    }
    pop.push(c)
  }
  return pop
}

module.exports = { generateTasks }
