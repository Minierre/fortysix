function generateRandomNumbers() {
  const min = -10
  const max = 10
  let list = new Array(10000000)
  for (let i = 0; i < 10000000; ++i) {
    list[i] = Math.random() * (max - min) + min
  }
  return list
}

function sumRandomNumbers() {
  let num = 0
  const listnums = generateRandomNumbers()
  for (let i = 0; i < listnums.length; ++i) {
    num += listnums[i]
  }
  return num
}

// const start = Date.now()
// for (let i = 0; i < 100; ++i) {
//   console.log(sumRandomNumbers())
// }

// console.log('Duration: ', (Date.now() - start) / 1000)

module.exports = {
  sumRandomNumbers,
  generateRandomNumbers
}
