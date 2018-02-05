const { expect } = require('chai')
const { RoomStats } = require('./stats')

describe('stats', () => {
  let roomStats

  const genOneFitnessData = [
    0.17100000831242745,
    1.9603998431142688,
    10.671558503917566,
    11.267005400454266,
    11.475167323639646,
    14.794385654987297,
    15.309591399324685,
    16.040928943463186,
    104.17600930163937,
    105.24528116182732,
    107.38448594725094,
    107.57150044938749,
    107.98260308885519,
    108.57858132480236,
    110.90065401187314,
    112.74576690485615,
    113.74516064456404,
    113.96947052510833,
    114.05940682875557,
    115.24320881603596,
    116.2762397603453,
    116.55622855390084,
    118.49314344130488,
    119.5309125664343,
    121.53110355326757,
    123.56138145299127,
    124.41509379551823,
    124.620153506774,
    125.14143926229973,
    126.17912411146501,
    127.11010776308376,
    127.21968507646721,
    130.8778175360039,
    130.97659558483903,
    132.2394538122652,
    132.36274913520282,
    132.69390022503953,
    133.33613375154604,
    135.07444945851356,
    136.57377418976216,
    137.0530303187041,
    137.6382528842305,
    137.88606463500878,
    139.77375311904675,
    141.20548884777097,
    142.04579642058584,
    142.36434526206097,
    142.79199291940756,
    145.7651473535016,
    146.9044846951173,
    146.9068354148126,
    146.95136013900574,
    149.91677548629937,
    150.6866453271204,
    152.5097705627607,
    154.03848242531004,
    154.34796960479056,
    154.67286240268942,
    157.26725853569258,
    157.94033412016918,
    158.2964451802034,
    163.23034809766895,
    167.69365974875333,
    170.8413324619568,
    171.2616784473751,
    172.33817769506425,
    172.8070238906718,
    173.2389987645521,
    173.28391638284782,
    173.2847276652265,
    173.86356754747837,
    174.18473949279706,
    175.4377038541378,
    176.117161023809,
    176.58878619493322,
    176.77115686580592,
    177.22029810724038,
    177.37593967498876,
    178.39413265899228,
    179.0617494475649,
    179.74116031428812,
    179.82234321927862,
    180.82049653340434,
    180.96060663912064,
    182.18546184882024,
    183.0676025959947,
    186.48288250404326,
    186.7220985308185,
    189.0187070894377,
    189.1371855355357,
    189.2178971174455,
    189.26993613550408,
    189.802368299989,
    189.9096166067303,
    189.96777785850907,
    190.44024349245387,
    191.14998800166555,
    191.4345087277448,
    191.76413531412072,
    191.92545622456709
  ]

  beforeEach(() => {
    roomStats = new RoomStats(3, 100)
  })

  it('expects generationFitnessData to have correct initial value', () => {
    expect(roomStats.generationFitnessesData).to.deep.equal({
      1: [],
      2: [],
      3: [],
    })
  })

  it('treats random data as random', () => {

    // Generating a random generation 1 fitness data and we are taking the top 2 percent of that data and assigning that to generation two fitnesses. This is uninuitively deterministic because the generation two fitnesses are a function of the generation one fitnesses
    const genOneFitnessData
      = new Array(1000).fill(1000).map(ele => ele * Math.random()).sort()

    const fitnesses = genOneFitnessData.slice(-20)

    const task = {
      gen: 2,
      // fitnesses always numbers
      fitnesses,
      // An unsorted array with duplicates
      genOneFitnessData
    }

    return roomStats.updateGenerationData(task).then(() => {
      expect(roomStats.getStats()).to.deep.equal([
        { 2: 0, name: 'Horrible' },
        { 2: 0, name: 'Very Bad' },
        { 2: 0, name: 'Bad' },
        // Rounding error
        { 2: 1.0000000000000002, name: 'Random' },
        { 2: 0, name: 'Not Bad' },
        { 2: 0, name: 'Good' },
        { 2: 0, name: 'Excellent' }])
    })
  })

  it('receives correct statistics from inserting a generation two task', () => {
    const task = {
      gen: 2,
      // These two fitnesses should be very outside the standard deviation of the top 10 percent of the generation one fitness scores that we see here.
      fitnesses: [3000, 1000],
      genOneFitnessData
    }

    return roomStats.updateGenerationData(task).then(() => {
      expect(roomStats.getStats()).to.deep.equal([
        { 2: 0, name: 'Horrible' },
        { 2: 0, name: 'Very Bad' },
        { 2: 0, name: 'Bad' },
        { 2: 0, name: 'Random' },
        { 2: 0, name: 'Not Bad' },
        { 2: 0.5, name: 'Good' },
        { 2: 0.5, name: 'Excellent' }])
    })
  })

  xit('receives correct statistics from inserting two generation two tasks', () => {

    const task = {
      gen: 2,
      fitnesses: [6, 5, 5, 0],
      genOneFitnessData: [0, 0, 0, 1, 3, 5, 7, 8, 9]
    }

    const task2 = {
      gen: 2,
      fitnesses: [3, 14, 7, 0],
      genOneFitnessData: [0, 0, 10, 2, 2, 2, 4, 7, 9]
    }

    roomStats.updateGenerationData(task)
    roomStats.updateGenerationData(task2)

    return roomStats.updateGenerationData(task).then(() => {
      expect(roomStats.getStats()).to.deep.equal([
        { 2: 0, name: 'Horrible' },
        { 2: 0, name: 'Very Bad' },
        { 2: 0, name: 'Bad' },
        { 2: 0.9166666666666667, name: 'Random' },
        { 2: 0.08333333333333333, name: 'Not Bad' },
        { 2: 0, name: 'Good' },
        { 2: 0, name: 'Excellent' }
      ])
    })
  })

  xit('recieves the correct statistics from add two generation two tasks and one generation three tasks', () => {

    const task = {
      gen: 2,
      fitnesses: [6, 5, 5, 0],
      genOneFitnessData: [1, 3, 5, 7, 0, 0, 0, 9, 8]
    }

    const task2 = {
      gen: 2,
      fitnesses: [3, 14, 7, 0],
      genOneFitnessData: [2, 9, 4, 2, 2, 0, 0, 10, 7]
    }

    const task3 = {
      gen: 3,
      fitnesses: [3, 14, 7, 0],
      genOneFitnessData: null
    }

    roomStats.updateGenerationData(task)
    roomStats.updateGenerationData(task2)
    roomStats.updateGenerationData(task3)

    return roomStats.updateGenerationData(task).then(() => {
      expect(roomStats.getStats()).to.deep.equal([
        { 2: 0, 3: 0, name: 'Horrible' },
        { 2: 0, 3: 0, name: 'Very Bad' },
        { 2: 0, 3: 0, name: 'Bad' },
        { 2: 0.9166666666666667, 3: 0.75, name: 'Random' },
        { 2: 0.08333333333333333, 3: 0.25, name: 'Not Bad' },
        { 2: 0, 3: 0, name: 'Good' },
        { 2: 0, 3: 0, name: 'Excellent' }
      ])
    })
  })
})
