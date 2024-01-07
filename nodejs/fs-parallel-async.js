const fs = require('node:fs/promises')

Promise.all([
  // Here we are controlling the order of the files
  fs.readFile('./file-1.txt', 'utf-8'),
  fs.readFile('./file-2.txt', 'utf-8')
]).then(([text1, text2]) => {
  console.log('text1 :>> ', text1)
  console.log('text2 :>> ', text2)
})
