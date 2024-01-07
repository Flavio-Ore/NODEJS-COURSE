// The extension is mandatory in ES6 modules
import nameless, { sum } from './module_design_pattern.mjs'

// .js -> by default use CommonJS
// .mjs -> by default use ES6 (ES Modules)
// .cjs -> by default use CommonJS

nameless.sum(1, 2) // 3
sum(1, 2) // 3
