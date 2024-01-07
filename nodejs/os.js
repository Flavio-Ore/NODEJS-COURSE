const os = require('node:os')

console.log('--- Operating System Info ---')

console.log('arch:', os.arch()) // x64

console.log('platform: ', os.platform()) // win32

console.log('cpus: ', os.cpus()) // model: 'Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz'

console.log('freemem:', os.freemem() / 1024 / 1024) // 1208.39453125mb

console.log('totalmem:', os.totalmem() / 1024 / 1024) // 8082.3359375mb

console.log('EOL:', os.EOL.toString()) // Returns the operating system's end-of-line marker.

console.log('homedir:', os.homedir()) //  C:\Users\GonHP

console.log('uptime:', os.uptime() / 60 / 60) // The number of seconds the system has been running.
