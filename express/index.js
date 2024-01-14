// Migration from http dir to express dir using express framework
const express = require('express')
const ditto = require('./../http/api.json')

const PORT = process.env.PORT ?? 3001

const app = express()

app.disable('x-powered-by') // Disable x-powered-by header

// app.use(express.json()) : express.json() is a middleware that parses incoming requests with JSON payloads and is based on body-parser.

// The following code is a custom implementation of express.json() middleware
app.use((req, res, next) => {
  if (
    req.method !== 'POST' ||
    req.headers['content-type'] !== 'application/json'
  ) {
    return next()
  }

  let data = ''

  req.on('data', chunk => {
    data += chunk.toString()
  })

  req.on('end', () => {
    req.body = data
    next()
  })
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(ditto)
})

app.post('/pokemon', (req, res) => {
  req.body.timestamp = Date.now()
  res.status(201).json(req.body)
})

app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>')
})

app.listen(PORT, () => {
  console.log('Listening on port http://localhost:' + PORT)
})
