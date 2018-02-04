const forEach = require('lodash/forEach')
const chalk = require('chalk')
const { spawn, config } = require('threads')
const sortedIndex = require('lodash/sortedIndex')

// Set-up worker thread
config.set({
  basepath: {
    node: __dirname,
  }
})

class RoomStats {
  constructor(generations, populationSize) {
    // this.averageGenerationStats = []
    this.statisticalFeedback = []
    this.graphData = []
    // so we don't recalculate the mean and the stdv at every incoming task, we store it
    this.counter = 0
    // stores object data that looks like {{2: [2345,2315]}, ...]
    this.generationFitnessesData = {}

    for (let i = 1; i <= generations; i++) {
      this.generationFitnessesData[i] = []
    }
    this.generations = generations
    this.selectionSize = 2 / populationSize
  }

  updateGenerationData(finishedTask) {
    // reformat the data into an optimized format for storage
    const { gen, fitnesses, genOneFitnessData } = finishedTask
    const thread = spawn('updateGenerationData.js')

    fitnesses.forEach((fitness) => {
      this.generationFitnessesData[gen]
        = this.binaryInsertion(this.generationFitnessesData[gen], fitness)
    })

    if (genOneFitnessData) {
      thread.send({
        genOneFitnessData,
        generationOneFitnessesData: this.generationFitnessesData[1],
      })
        .promise()
        .then(({ newGenerationOneFitnessesData }) => {
          thread.kill()
          this.generationFitnessesData[1] = newGenerationOneFitnessesData
          this.generateGraphData()
        })
    }
  }

  findMean(arr) {
    return arr.reduce((a, b) => a + b) / arr.length
  }

  findSD(arr, mean) {
    return Math.sqrt(this.findMean(arr.map(ele => (ele - mean) ** 2)))
  }

  findZScore(val, mean, sd) {
    return (val - mean) / sd
  }

  generateGraphData() {
    // sets up the zScoreBuckets
    const zScoreBucketHorrible = { name: 'Horrible' }
    const zScoreBucketVeryBad = { name: 'Very Bad' }
    const zScoreBucketBad = { name: 'Bad' }
    const zScoreBucketRandom = { name: 'Random' }
    const zScoreBucketNotBad = { name: 'Not Bad' }
    const zScoreBucketGood = { name: 'Good' }
    const zScoreBucketExcellent = { name: 'Excellent' }

    for (let i = 1; i <= this.generations; i++) {
      // incorporates a base zscore percentage of 0 in each of the zscore buckets per generation
      zScoreBucketHorrible[i] = 0
      zScoreBucketVeryBad[i] = 0
      zScoreBucketBad[i] = 0
      zScoreBucketRandom[i] = 0
      zScoreBucketNotBad[i] = 0
      zScoreBucketGood[i] = 0
      zScoreBucketExcellent[i] = 0

      // create an arr from gen1 fitnesses to normalize more mature generation fitness data
      const normalizationFactor = this.selectionSize ** (i - 1)
      let normalizationArr = normalizationFactor === 1 ?
        this.generationFitnessesData[1] :
        this.generationFitnessesData[1].slice(this.generationFitnessesData[1].length * normalizationFactor)
      // compute the normalized mean and sd
      const normalizedMean = this.findMean(normalizationArr)
      const normalizedSD = this.findSD(normalizationArr, normalizedMean)

      // go through each of the generations
      this.generationFitnessesData[i].forEach((fitness) => {
        const zScore = this.findZScore(fitness, normalizedMean, normalizedSD)
        switch (true) {
          case (zScore < -2.567):
            zScoreBucketHorrible[i] += (1 / this.generationFitnessesData[i].length)
            break
          case zScore >= -2.567 && zScore < -1.96:
            zScoreBucketVeryBad[i] += (1 / this.generationFitnessesData[i].length)
            break
          case zScore >= -1.96 && Number(zScore) < -1.645:
            zScoreBucketBad[i] += (1 / this.generationFitnessesData[i].length)
            break
          case zScore >= -1.645 && zScore < 1.645:
            zScoreBucketRandom[i] += (1 / this.generationFitnessesData[i].length)
            break
          case zScore >= 1.645 && zScore < 1.96:
            zScoreBucketNotBad[i] += (1 / this.generationFitnessesData[i].length)
            break
          case zScore >= 1.96 && zScore < 2.567:
            zScoreBucketGood[i] += (1 / this.generationFitnessesData[i].length)
            break
          case zScore > 2.567:
            zScoreBucketExcellent[i] += (1 / this.generationFitnessesData[i].length)
            break
          default:

            break
        }
      })
    }

    this.graphData = [
      zScoreBucketHorrible,
      zScoreBucketVeryBad,
      zScoreBucketBad,
      zScoreBucketRandom,
      zScoreBucketNotBad,
      zScoreBucketGood,
      zScoreBucketExcellent
    ]

    return this.graphData
  }

  binaryInsertion(array, value) {
    let index = sortedIndex(array, value)
    return array.slice(0, index).concat(value, array.slice(index))
  }

  getStats() {
    return this.graphData
  }
}

module.exports = { RoomStats }
