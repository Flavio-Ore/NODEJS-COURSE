const fs = require('node:fs')

// Reading the files synchronously blocks the execution of the rest of the code until the files are read ❌

console.log('Reading the first file synchronously...')
const text = fs.readFileSync('./file-1.txt', 'utf-8')

console.log('text1 :>> ', text)

console.log('Reading the second file synchronously...')
const text2 = fs.readFileSync('./file-2.txt', 'utf-8')

console.log('text2 :>> ', text2)

// Reading the files asynchronously allows the execution of the rest of the code while the files are read ✅

console.log('\nReading the first file asynchronously...')
fs.readFile('./file-1.txt', 'utf-8', (err, text) => {
  console.log('text1 :>> ', text)
})

console.log('Reading the second file asynchronously...')
fs.readFile('./file-2.txt', 'utf-8', (err, text) => {
  console.log('text2 :>> ', text)
})
