import express from 'express'
import logger from 'morgan'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 1000
  }
})
const MESSAGE = 'MESSAGE'
const CONNECTED = 'CONNECTED'
const DISCONNECT = 'DISCONNECT'

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/index.html`)
})

io.on('connection', socket => {
  const username = socket.handshake.auth.username ?? 'Anonymous'

  io.emit(CONNECTED, username, ' connected')
  socket.on(MESSAGE, msg => {
    io.emit(MESSAGE, msg, username)
  })
  socket.on('disconnect', () => {
    io.emit(DISCONNECT, username, ' disconnected')
  })
})

const PORT = process.env.PORT ?? 3001
httpServer.listen(PORT)
console.log(`Server is running on port: http://localhost:${PORT}`)
