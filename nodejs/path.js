const path = require('node:path')

// separator by operating system
console.log('path.sep :>> ', path.sep)

// join paths
const filePath = path.join('.', 'content', 'subfolder', 'test.txt')
console.log('filePath :>> ', filePath)

const base = path.basename('content/subfolder/test.txt')
console.log('base :>> ', base) // include extension

const filename = path.basename('content/subfolder/test.txt', 'txt')
console.log('filename :>> ', filename) // exclude extension

const extension = path.extname('my.project.com.js')
console.log('extension :>> ', extension)
