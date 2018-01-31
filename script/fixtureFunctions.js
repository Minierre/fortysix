// fitness function for matching an input string, default string = alphabet
const findString = ((c, targetString = 'abcdefghijklmnopqrstuvwxyz') => {
  let fitness = 0;
  let i;
  for (i = 0; i < c.length; ++i) {
    if (c[i] === targetString[i])
      fitness += 1;
    fitness += (127 - Math.abs(c.charCodeAt(i) - targetString.charCodeAt(i))) / 50;
  }
  return fitness;
}).toString()


// fitness function for game of life, disincentivises loops
const gameOfLifeFitness = ((c, w = 10) => {
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


// fitness function for game of life, rewards loops
const gameOfLifeFitnessLoopers = ((c, w = 10) => {
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


// pairs, splits, and splices every twosome of chromosomes in population ('pop') at some radom point in their gene sequence with probability = 'p'
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


// randomly changes any gene in each chromosome to another gene in the gene pool ('pool') with probability of any gene being effected = 'p'
let randomSettingMutation = ((pop, p = 0.02, pool = ['0', '1']) => {
  // checks to be sure all types in the population are same and output what they are
  console.log(pop, p, pool)
  const type = (pop.every((chromosome, _, ar) => {
    return typeof chromosome === typeof ar[0]
  })) ? typeof pop[0] : false
  return (type && type === 'string')
    ?
    pop.map(v => v.split('').map(w => (Math.random() < p) ? pool[Math.floor(Math.random() * pool.length)] : w).join(''))
    :
    pop.map(v => v.map(w => (Math.random() < p) ? pool[Math.floor(Math.random() * pool.length)] : w))
}).toString()


// randomly swaps genes in two positions of each chromosome effected, 'p' is chance of any given chromosome being effected
let swapMutation = ((pop, p = 0.02) => {
  // checks to be sure all types in the population are same and output what they are
  const type = (pop.every((chromosome, _, ar) => {
    return typeof chromosome === typeof ar[0]
  })) ? typeof pop[0] : false
  function swap(c) {
    let i = Math.floor(Math.random() * c.length)
    let j = Math.floor(Math.random() * c.length)
    let temp = c[i]
    c[i] = c[j]
    c[j] = temp
    return c
  }
  return (type && type === 'string')
    ?
    pop.map(v => v.split('').map(w => (Math.random() < p) ? swap(w) : w).join(''))
    :
    pop.map(v => v.map(w => (Math.random() < p) ? swap(w) : w))
}).toString()


// sudo randomly chooses 'n' chromosomes with fitness-weighted probability of choosing any given chromosome
let rouletteWheel = ((population, arrayOfFitnesses, n = 1) => {
  let selections = [];
  while (n > 0) {
    let TF = arrayOfFitnesses.reduce((a, b) => a + b, 0)
    let pick = Math.random() * TF
    let fitnessThusFar = 0
    let chosen = 0
    for (let i = 0; i < arrayOfFitnesses.length && fitnessThusFar < pick; i++) {
      chosen = i
      fitnessThusFar += arrayOfFitnesses[i]
    }
    selections.push(population[chosen])
    population.pop(chosen)
    arrayOfFitnesses.pop(chosen)
    n--
  }
  return selections;
}).toString()


// chooses 'n' best chromosomes
let fittest = ((population, arrayOfFitnesses, n = 1) => {
  const pop = []
  for (let i = 0; i < n; i++) {
    pop.push(population[arrayOfFitnesses.indexOf(Math.max(...arrayOfFitnesses))])
    population.splice(arrayOfFitnesses.indexOf(Math.max(...arrayOfFitnesses)))
    arrayOfFitnesses.splice(arrayOfFitnesses.indexOf(Math.max(...arrayOfFitnesses)))
  }
  return pop
}).toString()

module.exports = {
  findString,
  gameOfLifeFitness,
  gameOfLifeFitnessLoopers,
  crossOver,
  randomSettingMutation,
  swapMutation,
  rouletteWheel,
  fittest
}
