class RoomStats {
  constructor(generations) {
    this.stats = []
    // in order to compute stats, you need generation data
    this.generationData = {}

    for (let i = 2; i <= generations; i++) {
      this.stats.push({ name: `Generation ${i}`, fitness: null })
    }
  }

  updateGenerationData(finishedTask) {
    // reformat the data into an optimized format for storage
    const { gen, fitnesses } = finishedTask
    const fitnessSum = fitnesses.reduce((a, b) => a + b, 0)

    // update the generation data, so we can make accurate calculations
    this.generationData[gen] ?
      this.generationData[gen].push(fitnessSum) :
      this.generationData[gen] = [fitnessSum]

    return this.findNewMeans(gen)
  }

  findNewMeans(generation) {
    let sum = 0
    this.generationData[generation].forEach(fitness => sum += fitness)
    this.stats[generation - 2].fitness = sum / this.generationData[generation].length
    return this.stats
  }

  getStats() {
    return this.stats
  }
}

module.exports = { RoomStats }
