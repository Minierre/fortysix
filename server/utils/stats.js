const { mean } = require('simple-statistics')

class RoomStats {
  constructor() {
    this.stats = []
    this.generationData = {}
  }
  createBuckets(generations) {
    for (let i = 0; i < generations; i++) {
      this.stats.push({ name: `Generation ${i}`, fitness: null })
    }
  }
  updateGenerationData(finishedTask) {
    const data = {}
    data.generation = finishedTask.gen
    data.fitness = finishedTask.fitnesses.reduce((a, b) => a + b, 0)
    this.generationData[data.generation] ?
      this.generationData[data.generation].push(data.fitness) :
      this.generationData[data.generation] = [data.fitness]

    this.findNewMean(finishedTask.generation)
    return this.stats
  }
  findNewMean(generation) {
    this.stats[generation].fitness = mean(this.generationData[generation])
  }
  getStats() {
    return this.stats
  }
}

module.exports = { RoomStats }
