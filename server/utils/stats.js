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
    const stDv = Math.sqrt(this.findMean(arr.map(ele => (ele - mean) ** 2)))
    return stDv
  }
  findZScore(val, mean, sd) {
    return (val - mean) / sd
  }
  generateGraphData() {
    let graphData = []

    for (let i = 1; i <= this.generations; i++) {
      const normalizationFactor = Math.ceil(this.selectionSize ** i)
      // console.log(chalk.yellow(normalizationFactor,this.generationFitnessesData[1]))

      let mean = this.findMean(this.generationFitnessesData[1].slice(this.generationFitnessesData[1].length - normalizationFactor))
      let sd = this.findSD(this.generationFitnessesData[1].slice(this.generationFitnessesData[1].length - normalizationFactor), mean)
      // console.log(chalk.yellow(mean, sd))
      let generationZScore = this.generationFitnessesData[i].map((fitness) => {
        return this.findZScore(fitness, mean, sd)
      })
      // console.log(chalk.yellow(generationZScore))

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
