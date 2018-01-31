const db = require('../server/db')
const {
  User,
  Room,
  Mutations,
  Selections,
  RoomMutations,
  Parameters,
  RoomParameters
} = require('../server/db/models')

const FindString = ((c, targetString = 'abcde') => {
  let fitness = 0;
  let i;
  for (i = 0; i < c.length; ++i) {
    if (c[i] === targetString[i])
      fitness += 1;
    fitness += (127 - Math.abs(c.charCodeAt(i) - targetString.charCodeAt(i))) / 50;
  }
  return fitness;
}).toString()

const GoLFitness = ((c, w=10) => {
  let memo = {}
  let fitness = 1
  let testingChromosome = c
  function iterate(C, w) {
    if (memo[C]) {
      fitness /= 1.1
      return ('0').repeat(C.length)
    }
    memo[C] = true
    let newC = ''
    for (var i = 0; i < C.length; i++) {
      let neighbors = 0
      // if not wrapping to the left
      if (Math.floor((i - 1) / w) === Math.floor(i / w) && i > 0) {
        if (C[i - 1] === '1') neighbors++
        if (i - 1 - w > -1 && C[i - 1 - w] === '1') neighbors++
        if (i - 1 + w < C.length && C[i - 1 + w] === '1') neighbors++
      }
      // if not wrapping to the right
      if (Math.floor((i + 1) / w) === Math.floor(i / w) && i < C.length - 1) {
        if (C[i + 1] === '1') neighbors++
        if (i + 1 - w > -1 && C[i + 1 - w] === '1') neighbors++
        if (i + 1 + w < C.length && C[i + 1 + w] === '1') neighbors++
      }
      if (i - w > -1 && C[i - w] === '1') neighbors++
      if (i + w < C.length && C[i + w] === '1') neighbors++

      if (neighbors === 3 && C[i] === '0') newC += '1'
      else if (neighbors < 2 && C[i] === '1') newC += '0'
      else if (neighbors > 3 && C[i] === '1') newC += '0'
      else newC += C[i]
    }
    return newC
  }
  while (testingChromosome !== ('0').repeat(c.length)) {
    testingChromosome = iterate(testingChromosome, w)
    fitness *= 1.1
  }
  return fitness
}).toString()

const GoLFitnessLoopers = ((c, w = 10) => {
  let memo = {}
  let fitness = 1
  let testingChromosome = c
  function iterate(C, w) {
    if (memo[C]) {
      fitness *= 4
      return ('0').repeat(C.length)
    }
    memo[C] = true
    let newC = ''
    for (var i = 0; i < C.length; i++) {
      let neighbors = 0
      // if not wrapping to the left
      if (Math.floor((i - 1) / w) === Math.floor(i / w) && i > 0) {
        if (C[i - 1] === '1') neighbors++
        if (i - 1 - w > -1 && C[i - 1 - w] === '1') neighbors++
        if (i - 1 + w < C.length && C[i - 1 + w] === '1') neighbors++
      }
      // if not wrapping to the right
      if (Math.floor((i + 1) / w) === Math.floor(i / w) && i < C.length - 1) {
        if (C[i + 1] === '1') neighbors++
        if (i + 1 - w > -1 && C[i + 1 - w] === '1') neighbors++
        if (i + 1 + w < C.length && C[i + 1 + w] === '1') neighbors++
      }
      if (i - w > -1 && C[i - w] === '1') neighbors++
      if (i + w < C.length && C[i + w] === '1') neighbors++

      if (neighbors === 3 && C[i] === '0') newC += '1'
      else if (neighbors < 2 && C[i] === '1') newC += '0'
      else if (neighbors > 3 && C[i] === '1') newC += '0'
      else newC += C[i]
    }
    return newC
  }
  while (testingChromosome !== ('0').repeat(c.length)) {
    testingChromosome = iterate(testingChromosome, w)
    fitness *= 1.1
  }
  return fitness
}).toString()

let crossOver = ((pop, p = 0.2) => {
  for (var j = 1; j < pop.length; j++) {
    let c1 = pop[j]
    let c2 = pop[j - 1]
    if (Math.random() < p) {
      let i = Math.floor(Math.random() * (c1.length - 1))
      i++
      let c1b
      let c2b
      if (typeof c1 === 'string') {
        c1b = c1.slice(0, i) + c2.slice(i)
        c2b = c2.slice(0, i) + c1.slice(i)
      }
      else {
        c1b = c1.slice(0, i).concat(c2.slice(i))
        c2b = c2.slice(0, i).concat(c1.slice(i))
      }
      c1 = c1b
      c2 = c2b
    }
  }
  return pop
}).toString()

let RandomSettingMutation = ((pop, p = 0.02, pool = ['0', '1']) => {
  let type = typeof pop
  return (type === 'string')
    ?
    pop.map(v => v.split('').map(v => (Math.random() < p) ? pool[Math.floor(Math.random() * pool.length)] : v).join())
    :
    pop.map(v => v.map(v => (Math.random() < p) ? pool[Math.floor(Math.random() * pool.length)] : v))
}).toString()

let SwapMutation = ((pop, p = 0.02) => {
  let type = typeof pop
  function swap(c) {
    let i = Math.floor(Math.random() * c.length)
    let j = Math.floor(Math.random() * c.length)
    let temp = c[i]
    c[i] = c[j]
    c[j] = temp
    return c
  }
  return (type === 'string')
    ?
    pop.map(v => v.split('').map(v => (Math.random() < p) ? swap(v) : v).join())
    :
    pop.map(v => v.map(v => (Math.random() < p) ? swap(v) : v))
}).toString()

let rouletteWheel = ((population, arrayOfFitnesses, n = 1) => {
  let numSelectionsLeft = n;
  let selections = [];
  let totalFit = arrayOfFitnesses.reduce((a, b) => a + b, 0);
  let j = 0
  while (numSelectionsLeft > 0) {
    let randomFitnessLvl = Math.random() * totalFit;
    for (let i = 0; i < arrayOfFitnesses.length; i++) {
      randomFitnessLvl -= arrayOfFitnesses[i];
      if (randomFitnessLvl <= 0) {
        selections.push(population[i]);
        totalFit -= arrayOfFitnesses[i];
        arrayOfFitnesses[i] = 0;
        numSelectionsLeft -= 1;
        break;
      }
    }
  }
  return selections;
}).toString()

let Fittest = ((population, arrayOfFitnesses, n = 1) => {
  const pop = []
  for (let i = 0; i < n; i++) {
    pop.push(population[arrayOfFitnesses.indexOf(Math.max(...arrayOfFitnesses))])
    population.splice(arrayOfFitnesses.indexOf(Math.max(...arrayOfFitnesses)))
    arrayOfFitnesses.splice(arrayOfFitnesses.indexOf(Math.max(...arrayOfFitnesses)))
  }
  return pop
}).toString()


async function seed() {
  await db.sync({ force: true })
  console.log('db synced!')
  // Whoa! Because we `await` the promise that db.sync returns, the next line will not be
  // executed until that promise resolves!

  const users = await Promise.all([
    User.create({ email: 'cody@email.com', password: '123' }),
    User.create({ email: 'murphy@email.com', password: '123' })
  ])

  const mutations = await Promise.all([
    Mutations.create({ function: crossOver, name: 'Cross Over' }),
    Mutations.create({ function: RandomSettingMutation, name: 'Random Setting Mutation' }),
    Mutations.create({ function: SwapMutation, name: 'Swap Mutation' }),
  ])

  const selections = await Promise.all([
    Selections.create({ function: rouletteWheel, name: 'Roulette Wheel' }),
    Selections.create({ function: Fittest, name: 'Fittest' }),
  ])

  const rooms = await Promise.all([
    Room.create({
      roomName: 'Game of Life',
      fitnessFunc: GoLFitness,
      selectionId: 1
    }),
    Room.create({
      roomName: 'Game of Life Loopers',
      fitnessFunc: GoLFitnessLoopers,
      selectionId: 2
    }),
    Room.create({
      roomName: 'String Matcher',
      fitnessFunc: FindString,
      selectionId: 1
    })
  ])

  const parameters = await Promise.all([
    Parameters.create({
      chromosomeLength: 50,
      generations: 2,
      elitism: 0,
      populationSize: 50,
      fitnessGoal: 100
    })
  ])

  const roomParameters = await Promise.all([
    RoomParameters.create({
      roomId: 1,
      parameterId: 1
    })
  ])

  const roomMutations = await Promise.all([
    RoomMutations.create({
      mutationId: 1,
      roomId: 1,
      chanceOfMutation: 0
    }),
    RoomMutations.create({
      mutationId: 2,
      roomId: 1,
      chanceOfMutation: 0
    })
  ])

  // Wowzers! We can even `await` on the right-hand side of the assignment operator
  // and store the result that the promise resolves to in a variable! This is nice!
  console.log(`seeded ${users.length} users`)
  console.log('seeded successfully')
}

// Execute the `seed` function
// `Async` functions always return a promise, so we can use `catch` to handle any errors
// that might occur inside of `seed`
seed()
  .catch((err) => {
    console.error(err.message)
    console.error(err.stack)
    process.exitCode = 1
  })
  .then(() => {
    console.log('closing db connection')
    db.close()
    console.log('db connection closed')
  })

/*
 * note: everything outside of the async function is totally synchronous
 * The console.log below will occur before any of the logs that occur inside
 * of the async function
 */
console.log('seeding...')
