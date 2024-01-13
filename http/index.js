const http = require('node:http')
const fs = require('node:fs/promises')
const path = require('node:path')
const pokeRouter = require('./routing.js')

const port = process.argv.PORT ?? 3001

const processRequest = (req, res) => {
  if (req.url === '/') {
    res.statusCode = 200
    return res.end('<h1>Hello Node</h1>')
  } else if (req.url === '/pokemon' || req.url === '/pokemon/ditto') {
    pokeRouter(req, res)
  } else if (req.url === '/image.webp') {
    fs.readFile(path.join(__dirname, 'neuschwanstein.webp'))
      .then(data => {
        res.setHeader('Content-Type', 'image/webp')
        return res.end(data)
      })
      .catch(err => {
        console.error(err)
        res.statusCode = 500
        return res.end('<h1>500 Internal Server Error</h1>')
      })
  } else {
    res.statusCode = 404
    return res.end('<h1>Not Found</h1>')
  }
}
const requestListener = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=uft-8')
  processRequest(req, res)
}

const server = http.createServer(requestListener)

server.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`)
})
