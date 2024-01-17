import express from 'express'
import { corsMiddleware } from './middlewares/cors.middleware.js'
import { moviesRouter } from './routes/movies.route.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(express.json())

app.use('/api/movies', moviesRouter)

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
)
