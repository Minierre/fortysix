const { expect } = require('chai')
const { RoomStats } = require('./stats')

xdescribe('stats', () => {
  let roomStats

  beforeEach(() => {
    roomStats = new RoomStats(3, 100)
  })

  it('expects zScoreBuckets to have the correct labels', () => {
    expect(roomStats.zScoreBuckets).to.deep.equal({
      name: 'bad', generations: {},
      name: 'not good', generations: {},
      name: 'random', generations: {},
      name: 'statistically insignificant', generations: {},
      name: 'statistically significant', generations: {}
    })
  })

  it('expects generationFitnessData to have correct initial value', () => {
    expect(roomStats.generationFitnessesData).to.deep.equal({
      1: [],
      2: [],
      3: [],
    })
  })

  it('inserts updated generationData in sorted order', () => {
    const task = {
      gen: 2,
      // fitnesses always numbers
      fitnesses: [6, 5, 5, -2, -2, 0],
      // An unsorted array with duplicates
      genOneFitnessData: [1, 3, 5, 7, -2, -2, 0, 0, 0, 9, 8]
    }

    roomStats.updateGenerationData(task)

    expect(roomStats.generationFitnessesData).to.deep.equal({
      1: [-2, -2, 0, 0, 0, 1, 3, 5, 7, 8, 9],
      2: [-2, -2, 0, 5, 5, 6],
      3: [],
    })
  })

  it('updates multiple generationData buckets when receiving multiple tasks in succession', () => {

    const task = {
      gen: 2,
      fitnesses: [6, 5, 5, -2, -2, 0],
      genOneFitnessData: [1, 3, 5, 7, -2, -2, 0, 0, 0, 9, 8]
    }

    const task2 = {
      gen: 2,
      fitnesses: [3, 14, 7, -1, -2, 0],
      genOneFitnessData: [2, 9, 4, 2, -1, -5, 2, 0, 0, 10, 7]
    }

    roomStats.updateGenerationData(task)
    roomStats.updateGenerationData(task2)

    expect(roomStats.generationFitnessesData).to.deep.equal({
      1: [-5, -2, -2, -1, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 5, 7, 7, 8, 9, 9, 10],
      2: [-2, -2, -2, -1, 0, 0, 3, 5, 5, 6, 7, 14],
      3: [],
    })
  })

  it('adds non generation two finished tasks properly', () => {

    const task = {
      gen: 2,
      fitnesses: [6, 5, 5, -2, -2, 0],
      genOneFitnessData: [1, 3, 5, 7, -2, -2, 0, 0, 0, 9, 8]
    }

    const task2 = {
      gen: 2,
      fitnesses: [3, 14, 7, -1, -2, 0],
      genOneFitnessData: [2, 9, 4, 2, -1, -5, 2, 0, 0, 10, 7]
    }

    const task3 = {
      gen: 3,
      fitnesses: [3, 14, 7, -1, -2, 0],
      genOneFitnessData: null
    }

    roomStats.updateGenerationData(task)
    roomStats.updateGenerationData(task2)
    roomStats.updateGenerationData(task3)

    expect(roomStats.generationFitnessesData).to.deep.equal({
      1: [-5, -2, -2, -1, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 4, 5, 7, 7, 8, 9, 9, 10],
      2: [-2, -2, -2, -1, 0, 0, 3, 5, 5, 6, 7, 14],
      3: [-2, -1, 0, 3, 7, 14]
    })
  })
  it('outputs the graph data in the correct format', () => {
    const task = {
      gen: 2,
      fitnesses: [6],
      genOneFitnessData: [0]
    }
    roomStats.updateGenerationData(task)
    roomStats.generateGraphData()
    expect(roomStats.graphData).to.deep.equal([{ '1': 0, '2': 0, '3': 0, name: 'veryBad' },
    { '1': 0, '2': 0, '3': 0, name: 'horrible' },
    { '1': 0, '2': 0, '3': 0, name: 'bad' },
    {
      '1': 0,
      '2': 0,
      '3': 0,
      name: 'random'
    },
    { '1': 0, '2': 0, '3': 0, name: 'notBad' },
    { '1': 0, '2': 0, '3': 0, name: 'good' },
    {
      '1': 0,
      '2': 1,
      '3': 0,
      name: 'excellent'
    }])
  })
})
