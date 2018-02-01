const { mean } = require('simple-statistics')

class RoomStats {
  constructor() {
    this.finalStats = []
    this.generationData = {}
  }
  createBuckets(generations) {
    for (let i = 0; i < generations; i++) {
      this.stats.push({ name: `Generation ${i}`, fitness: null })
    }
  }
  updateGenerationData(incomingResult) {
    this.generationData[incomingResult.generation] ?
      this.generationData[incomingResult.generation].push(incomingResult.fitness) :
      this.generationData[incomingResult.generation] = [incomingResult.fitness]

    this.findNewMean(incomingResult.generation)
  }
  findNewMean(generation) {
    this.finalStats[generation].fitness = mean(this.generationData[generation])
  }
  fetchStats() {
    return this.finalStats
  }
}

module.exports = { RoomStats }
