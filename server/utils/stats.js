const forEach = require('lodash/forEach')
const chalk = require('chalk')
const sortedIndex = require('lodash/sortedIndex')

class RoomStats {
  constructor(generations, populationSize) {
    // this.averageGenerationStats = []
    this.statisticalFeedback = []
    // in order to compute stats, you need individual generation and chromosome data
    // this.generationData = {}
    // this.generationFitnessesData = []
    // so we don't recalculate the mean and the stdv at every incoming task, we store it
    this.queue = []
    // looks like [{gen: 2, fit: 2345}, {gen: 2, fit: 2342}]
    this.generationFitnessesData = {}
    this.zScoreBuckets = {
      name: "bad", generations: {},
      name: "not good", generations: {},
      name: "random", generations: {},
      name: "statistically insignificant", generations: {},
      name: "statistically significant", generations: {}
    }

    for (let i = 1; i <= generations; i++) {
      this.generationFitnessesData[i] = []
    }
    // console.log(this.generationFitnessesData)
    this.generations = generations
    this.selectionSize = 2 / populationSize
  }

  updateGenerationData(finishedTask) {
    // reformat the data into an optimized format for storage
    const { gen, fitnesses, genOneFitnessData } = finishedTask

    // we insert the first generation data into the array, in a sorted order
    if (genOneFitnessData) genOneFitnessData.forEach((fitness) => {
      this.generationFitnessesData[1] = this.binaryInsertion(this.generationFitnessesData[1], fitness)
    })
    // every task comes back with fitness data too, which we store
    fitnesses.forEach((fitness) => {
      this.generationFitnessesData[gen] = this.binaryInsertion(this.generationFitnessesData[gen], fitness)
    })

    return this.generateGraphData()
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
    let graphData = []
    for (let i = 1; i <= this.generations; i++) {
      const normalizationFactor = this.selectionSize ** i
      const normalizationArr = this.generationFitnessesData[1].slice(this.generationFitnessesData[1].length * normalizationFactor)

      const mean = this.findMean(normalizationArr)
      const sd = this.findSD(normalizationArr, mean)
      let generationZScore = this.generationFitnessesData[i].map((fitness) => {
        return this.findZScore(fitness, mean, sd)
      })
      const zScoreBucket = {}
      graphData.push(zScoreBucket)
    }
    return graphData
  }

  binaryInsertion(array, value) {
    var index = sortedIndex(array, value)
    array = array.slice(0, index).concat(value, array.slice(index))
    return array
  }
}

module.exports = { RoomStats }
