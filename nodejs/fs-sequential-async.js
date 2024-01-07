const fs = require('node:fs/promises')

/*
const text1 = await fs.readFile('./file-1.txt', 'utf-8')
console.log('text1 :>> ', text1)

const text2 = await fs.readFile('./file-2.txt', 'utf-8')
console.log('text2 :>> ', text2)
*/

// The code above is not valid because await is only valid in async functions and the top level bodies of modules and in a .mjs file

// You can use the IIFE (Inmediatly  Invoked Function Expression) pattern to use await in the top level of a module
;(async () => {
  const text1 = await fs.readFile('./file-1.txt', 'utf-8')
  console.log('text1 :>> ', text1)

  const text2 = await fs.readFile('./file-2.txt', 'utf-8')
  console.log('text2 :>> ', text2)
})()
