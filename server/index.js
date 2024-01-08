const http = require('node:http')
const { getAvailablePort } = require('./freePort.js')

const PORT = process.argv.PORT ?? 3001

const busyServer = http.createServer((req, res) => {
  res.end('Oh no!')
})

const server = http.createServer((req, res) => {
  console.log('request made')
  res.end('Hello World')
})

async function startBusyServer () {
  busyServer.listen(PORT, () => {
    console.log(`busy server is listening on port http://localhost:${PORT}`)
  })
}

async function startServer () {
  const port = await getAvailablePort(PORT)
  server.listen(port, () => {
    console.log(`listening for requests on port http://localhost:${port}`)
  })
}

startBusyServer()
startServer()
