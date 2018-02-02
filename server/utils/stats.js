const forEach = require('lodash/forEach')
const chalk = require('chalk')

class RoomStats {
  constructor(generations, populationSize) {
    // this.averageGenerationStats = []
    this.statisticalFeedback = []
    // in order to compute stats, you need individual generation and chromosome data
    // this.generationData = {}
    this.generationFitnessData = []
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
      this.generationFitnessData[i] = []
    }
    this.generations = generations
    this.selectionSize = 2 / populationSize
  }

  updateGenerationData(finishedTask) {
    // reformat the data into an optimized format for storage
    const { gen, fitnesses, genOneFitnessData } = finishedTask

    // we insert the first generation data into the array, in a sorted order
    if (genOneFitnessData) genOneFitnessData.forEach((fitness) => {
      this.generationFitnessData[1] = this.binaryInsertion(this.generationFitnessData[1], fitness)
    })
    // every task comes back with fitness data too, which we store
    fitnesses.forEach((fitness) => {
      this.generationFitnessData[gen] = this.binaryInsertion(this.generationFitnessData[gen], fitness)
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
      let mean = this.findMean(this.generationFitnessData[1].slice(this.generationFitnessData[1].length - normalizationFactor))
      let sd = this.findSD(this.generationFitnessData[1].slice(this.generationFitnessData[1].length - normalizationFactor))

      const zScoreBucket = {}
      graphData.push(zScoreBucket)
    }
    return graphData
  }
  binaryInsertion(arr, value) {
    let n = Math.floor(arr.length / 2)
    let m = Math.floor(arr.length / 4)
    while (n !== 0 && n !== arr.length - 1 && m > 0) {
      if (arr[n] <= value && arr[n + 1] > value) {
        return arr.slice(0, n + 1).concat(value).concat(arr.slice(n + 1))
      } else if (arr[n] > value) {
        n -= m
      } else if (arr[n] < value) {
        n += m
      }
      m = (m === 1) ? 0 : Math.ceil(m / 2)
    }
    if (arr[n] <= value && arr[n + 1] > value) {
      return arr.slice(0, n + 1).concat(value).concat(arr.slice(n + 1))
    } else if (n === arr.length - 1) return arr.concat([value])
    return ([value]).concat(arr)
  }
}

module.exports = { RoomStats }
