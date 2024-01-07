const fs = require('node:fs/promises')

// if a module doesn't have a /promises folder, you can use the promisify function as follows
const { promisify } = require('node:util')
const readFilePromise = promisify(fs.readFile)

console.log('Reading the first file asynchronously...')
fs.readFile('./file-1.txt', 'utf-8').then(text =>
  console.log('text1 :>> ', text)
)

console.log('Reading the second file asynchronously...')
fs.readFile('./file-2.txt', 'utf-8').then(text =>
  console.log('text2 :>> ', text)
)
