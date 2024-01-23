const net = require('node:net')
const pc = require('picocolors')

function getAvailablePort (portToTry) {
  return new Promise((resolve, reject) => {
    const netServer = net.createServer()
    netServer.listen(portToTry, () => {
      const { port } = netServer.address()
      netServer.close(() => {
        console.log(pc.green(`✔ Port ${pc.bold(port)} is available`))
        resolve(port)
      })
    })
    netServer.on('error', err => {
      if (err.code === 'EADDRINUSE') {
        getAvailablePort(0).then(port => {
          console.log(
            pc.yellow(
              `✖ Port ${pc.bold(
                portToTry
              )} is in use, trying with port ${pc.bold(port)}`
            )
          )
          resolve(port)
        })
      } else reject(err)
    })
  })
}

module.exports = { getAvailablePort }
