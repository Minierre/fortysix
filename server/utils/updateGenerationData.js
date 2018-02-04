const sortedIndex = require('lodash/sortedIndex')

function binaryInsertion(array, value) {
  const index = sortedIndex(array, value)
  return array.slice(0, index).concat(value, array.slice(index))
}

function updateGenerationData({
  genOneFitnessData,
  generationOneFitnessesData,
}, done) {
  let newGenerationOneFitnessesData = generationOneFitnessesData
  genOneFitnessData.forEach((fitness) => {
    newGenerationOneFitnessesData =
      binaryInsertion(newGenerationOneFitnessesData, fitness)
  })
  done({ newGenerationOneFitnessesData })
}

module.exports = updateGenerationData
