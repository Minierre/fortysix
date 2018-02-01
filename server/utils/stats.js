const { mean } = require('simple-statistics')

class RoomStats {
  constructor() {
    this.stats = []
    // in order to compute stats, you need generation data
    this.generationData = {}
  }
  createBuckets(generations) {
    this.stats = []
    for (let i = 0; i <= generations; i++) {
      this.stats.push({ name: `Generation ${i}`, fitness: null })
    }
  }
  updateGenerationData(finishedTask) {
    // reformat the data into an optimized format for storage
    const data = {}
    data.gen = finishedTask.gen
    data.fitness = finishedTask.fitnesses.reduce((a, b) => a + b, 0)

    // update the generation data, so we can make accurate calculations
    this.generationData[data.gen] ?
      this.generationData[data.gen].push(data.fitness) :
      this.generationData[data.gen] = [data.fitness]

    this.findNewMean(data.gen)
    return this.stats
  }
  findNewMean(generation) {
    let sum = 0
    this.generationData[generation].forEach(fitness => sum += fitness)
    this.stats[generation].fitness = sum / this.generationData[generation].length
  }
  getStats() {
    return this.stats
  }
}

module.exports = { RoomStats }
