const a = require('./module_design_pattern')
const { sum } = require('./module_design_pattern')

// .js -> by default use CommonJS
// .mjs -> by default use ES6 (ES Modules)
// .cjs -> by default use CommonJS

a.sum(1, 2) // 3
sum(1, 2) // 3
