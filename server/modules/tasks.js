const uuid = require('uuid/v1')

//reorganizing params based of usage and need.
function generateTasks( //name this function better. 
  populationSize,
  room, //hash of a room. move this hashing to models. 
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
      mutations,
      selection,
      elitism
    }
    tasks.push(task)
  }
  return tasks
}

//order of params. 
function genPop(length, populationSize, probability = 0.5) {
  const pop = []
  for (let i = 0; i < populationSize; i++) {
    //maybe not call this 'c'
    let c = ''
    for (let j = 0; j < length; j++) {
      // Randomly generate binary string
      //this should be less than.
      c += (Math.random() < probability) ? '1' : '0'
    }
    pop.push(c)
  }
  return pop
}

module.exports = { generateTasks }
