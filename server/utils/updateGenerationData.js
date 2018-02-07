const sortedIndex = require('lodash/sortedIndex')

function binaryInsertion(array, value) {
  const index = sortedIndex(array, value)
  return array.slice(0, index).concat(value, array.slice(index))
}

function updateGenerationData({
  genOneFitnessData,
  generationOneFitnessesData,
  fitnesses,
  generationFitnessesData
}, done) {
  let newGenerationOneFitnessesData = generationOneFitnessesData
  genOneFitnessData.forEach((fitness) => {
    newGenerationOneFitnessesData = binaryInsertion(newGenerationOneFitnessesData, Math.log(fitness + 1))
  })

  const newGenerationFitnessesData = generationFitnessesData
  fitnesses.forEach(fitness => newGenerationFitnessesData.push(Math.log(fitness + 1)))
  done({ newGenerationOneFitnessesData, newGenerationFitnessesData })
}

module.exports = updateGenerationData
