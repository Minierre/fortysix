const normalize = require('normalize-samples')
const forEach = require('lodash/forEach')
const BST = require('js-algorithms/src/data-structures/binary-search-tree');
const chalk = require('chalk')

class RoomStats {
  constructor(generations) {
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

    // for (let i = 2; i <= generations; i++) {
    //   this.averageGenerationStats.push({ name: `Generation ${i}`, fitness: null })
    // }

    for (let i = 1; i <= generations; i++) {
      this.generationFitnessData[i] = []
    }


  }

  updateGenerationData(finishedTask) {
    // reformat the data into an optimized format for storage
    const { gen, fitnesses, genOneFitnessData } = finishedTask
    // const fitnessSum = fitnesses.reduce((a, b) => a + b, 0)

    // update the generation data, so we can make accurate calculations
    // this.generationData[gen] ?
    //   this.generationData[gen].push(fitnessSum) :
    //   this.generationData[gen] = [fitnessSum]

    // additions below this line are for calculating the statisticalFeedback graph

    // return this.findNewMeans(gen) <-- for the average fitness graph



    // since incoming tasks can have more than one incoming selected chromosome, we separate the selected chromosomes into separate objects and store them in the queue

    // if there is generation one fitness data, then store that data for z-score normalization
    if (genOneFitnessData) genOneFitnessData.forEach(fitness => this.generationFitnessData[gen].push(fitness))
    // we always take the fitness data
    fitnesses.forEach(fitness => this.generationFitnessData[gen].push(fitness))

    // choose how frequent we want the data to be recalculated (the higher, the longer time between recalculations)
    // const calculationFrequency = 5

    // if (this.queue.length >= calculationFrequency) {
    //   return this.calculateStatisticalFeedback()
    // }
    return this.calculateStatisticalFeedback()
  }

  calculateStatisticalFeedback() {
    // store the latest generation data in one object
    // this.generationFitnessData = this.generationFitnessData.concat(this.queue)
    // once the data is stored, empty the queue
    // this.queue = []
    // store an array of fitnesses so we can calculate the mean and standard deviation
    const genOneFitnesses = []

    this.generationFitnessData[1].fitnesses.forEach(fitness => genOneFitnesses.push(fitness))

    const mean = this.findMean(genOneFitnesses)
    const stDv = this.findStDv(genOneFitnesses, mean)
    return this.generateGraphData(this.generationFitnessData, mean, stDv)
  }

  findMean(arr) {
    return arr.reduce((a, b) => a + b) / arr.length
  }

  findStDv(arr, mean) {
    const stDv = Math.sqrt(this.findMean(arr.map(ele => (ele - mean) ** 2)))
    return stDv
  }

  generateGraphData(sample, mean, stDv) {
    console.log(chalk.yellow('SAMPLE', sample))
  }

  // findNewMeans(generation) {
  //   let sum = 0
  //   this.generationData[generation].forEach(fitness => sum += fitness)
  //   this.averageGenerationStats[generation - 2].fitness = sum / this.generationData[generation].length
  //   return this.averageGenerationStats
  // }


  // getStats() {
  //   return this.averageGenerationStats
  // }
}

module.exports = { RoomStats }
