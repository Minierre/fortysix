const chalk = require('chalk')

// grabs the last generation from the room's bucket, and runs the fitness function
// on all the chromosomes, returning the chromosome with the highest fitness
function finalSelection(finalResult, room) {
  const finalGeneration = room.bucket[room.maxGen]
  const results = {}
  results.room = room

  let mostFit = finalGeneration.fitnesses[0]
  let mostFitChromosome = finalGeneration.population[0]

  for (let i = 0; i < finalGeneration.fitnesses.length; i++) {
    if (finalGeneration.fitnesses[i] > mostFit) {
      mostFit = finalGeneration.fitnesses[i]
      mostFitChromosome = finalGeneration.population[i]
    }
  }
  results.fitness = mostFit
  results.winningChromosome = mostFitChromosome
  return results
}

// NEEDS TO RETURN A ROOMID FOR WHEN THE HISTORY GETS CREATED IN DB

module.exports = { finalSelection }
