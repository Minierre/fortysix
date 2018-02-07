// fitness function for matching an input string, default string = alphabet
const findString = ((c, targetString = 'abel daniel') => {
  let fitness = 0;
  let i;
  for (i = 0; i < c.length; ++i) {
    if (targetString.includes(c[i])) fitness += 100;
    fitness -= (127 - Math.abs(c[i].charCodeAt(0) - targetString.charCodeAt(i))) / (targetString.length ** 2);
  }
  for (i = 0; i < c.length; ++i) {
    if (c[i] === targetString[i]) fitness *= 3;
  }
  return Math.max(fitness, 0);
}).toString()

// fitness function for writing an arrow function that returns hello world
const helloWorld = ((c) => {
  c = c.join('')

  let stringDif = (str0, str1) => {
    let numWrong = Math.abs(str1.length - str0.length)
    for (var i = 0; i < Math.min(str0.length, str1.length); i++) {
      if (str1[i] !== str0[i]) numWrong++
    }
    return numWrong
  }

  let fitness = .001
  try {
    fitness += 10
    let value = eval('(' + c + ')')()
    if (typeof value === 'string') {
      fitness *= 1000
      fitness /= stringDif(value, 'hello world')
      if (value.length === ('hello world').length) {
        fitness *= 100
      }
      if (value.split(' ').join('').toLowerCase() === 'helloworld') {
        fitness = 100000000
      }
      else if (value === 'hello world') {
        fitness = 1000000000
      }
    }
    if (typeof value !== 'undefined') {
      fitness *= 1000
    }
    return fitness
  }
  catch (e) {
    if (c.includes('=>') && c.trimLeft()[0] === '(' && c.trimLeft()[1] === ')' && c.indexOf('=>') > c.indexOf('(') && c.indexOf('(') > c.indexOf(')')) {
      fitness += 2
    }
    else if (c.includes('=>') && c.trimLeft()[0] === '(' && c.trimLeft()[1] === ')') {
      fitness += .5
    }
    else if (c.trimLeft()[0] === '(' && c.trimLeft()[1] === ')') {
      fitness += .1
    }
    else if (c.includes('=>')) {
      fitness += .5
    }
    let funcPatterns = ["()=>\"helloworld\""]
    let difs = []
    for (var l = 0; l < funcPatterns.length; l++) {
      difs.push(stringDif(c.split(" ").join(""), funcPatterns[l]))
    }
    fitness += (c.length - (Math.min.apply(null, difs))) * .05
    return fitness
  }
}).toString()

// fitness function for game of life, disincentivises loops
const gameOfLifeFitness = ((c, w = 10) => {
  c = c.join('')
  const memo = {}
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
  c = c.join('')
  const memo = {}
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
let crossOver = ((pop, p) => {
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
let randomSettingMutation = ((pop, p, pool) => {
  // checks to be sure all types in the population are same and output what they are
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
let swapMutation = ((pop, p) => {
  // swaps two random genes in a chromosome
  function swap(c) {
    let i = Math.floor(Math.random() * c.length)
    let j = Math.floor(Math.random() * c.length)
    let temp = c[i]
    c[i] = c[j]
    c[j] = temp
    return c
  }
  // mutates each chromosome in the population 'pop' with probability p
  return pop.map((chromosome) => {
    return (Math.random() < p) ? swap(chromosome) : chromosome
  })
}).toString()

// sudo randomly chooses 'n' chromosomes with fitness-weighted probability of choosing any given chromosome
let rouletteWheel = ((population, arrayOfFitnesses, n = 1) => {
  const pop = population.slice()
  const fit = arrayOfFitnesses.slice()
  const selections = [];
  while (n > 0) {
    let TF = fit.reduce((a, b) => a + b, 0)
    let pick = Math.random() * TF
    let fitnessThusFar = 0
    let chosen = 0
    for (var i = 0; i < fit.length && fitnessThusFar < pick; i++) {
      chosen = i
      fitnessThusFar += fit[i]
    }
    selections.push(pop[chosen])
    pop.pop(chosen)
    fit.pop(chosen)
    n--
  }
  return selections;
}).toString()


// chooses 'n' best chromosomes
let fittest = ((population, arrayOfFitnesses, n = 1) => {
  const pop = population.slice()
  const fit = arrayOfFitnesses.slice()
  const selections = []
  for (let i = 0; i < n; i++) {
    selections.push(pop[fit.indexOf(Math.max(...fit))])
    pop.pop(fit.indexOf(Math.max(...fit)))
    fit.pop(fit.indexOf(Math.max(...fit)))
  }
  return selections
}).toString()

module.exports = {
  findString,
  helloWorld,
  gameOfLifeFitness,
  gameOfLifeFitnessLoopers,
  crossOver,
  randomSettingMutation,
  swapMutation,
  rouletteWheel,
  fittest
}
