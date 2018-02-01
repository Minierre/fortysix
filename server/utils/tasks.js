const uuid = require('uuid/v1')

function generateTasks(
  populationSize,
  room,
  numTasks,
  fitness,
  mutations,
  selection,
  chromosomeLength,
  genePool,
  reproductiveCoefficient
) {
  const tasks = []

  for (let i = 0; i < numTasks; i++) {
    const task = {
      room,
      id: uuid(),
      gen: 1,
      population: genPop(chromosomeLength, populationSize, genePool),
      fitness,
      mutations,
      selection,
      genePool,
      reproductiveCoefficient
    }
    tasks.push(task)
  }
  return tasks
}

// generates a randome population of size = 'populationSize', composed of chromosomes of length = 'length', composed of genes from the genepool = 'pool'
function genPop(length, populationSize, pool, probability = 0.5) {
  const pop = []
  for (let i = 0; i < populationSize; i++) {
    let c = ''
    for (let j = 0; j < length; j++) {
      // Randomly generate binary string
      c += pool[Math.floor(Math.random() * pool.length)]
    }
    pop.push(c)
  }
  return pop
}

module.exports = { generateTasks }
