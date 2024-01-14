const express = require('express')
const {
  validateMovieSchema,
  validatePartialMovieSchema
} = require('./movie.schema.js')
const crypto = require('node:crypto')
// const cors = require('cors')
const movies = require('./movies.json')

const app = express()
const PORT = process.env.PORT ?? 3001
const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5500/api/index.html',
  'http://localhost:5500',
  'http://localhost:3001'
]

// app.use(cors()) by default allows all origins for example: app.use(cors({ origin: '*' }))
// We change it to allow only the origins in the ALLOWED_ORIGINS array
/*
  app.use(cors({
    origin: (origin, callback) {
      const ALLOWED_ORIGINS = [...]
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    }
  }))
*/
app.disable('x-powered-by')

/*
  Normal methods: GET/HEAD/POST
  Complex methods: PUT/PATCH/DELETE

  CORS pre-flight: Complex methods requieres a special request called OPTIONS
*/

app.use(express.json())

// All the resources named Movies are identified by /movies
app.get('/movies', (req, res) => {
  const ORIGIN = req.header('origin')
  console.log('ORIGIN :>> ', ORIGIN)
  if (ALLOWED_ORIGINS.includes(ORIGIN) || !ORIGIN) {
    res.header('Access-Control-Allow-Origin', ORIGIN)
  }

  const { genre } = req.query
  if (genre) {
    const filteredMoviesByGenre = movies.filter(movie =>
      movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )

    if (genre) return res.json(filteredMoviesByGenre)
  }
  res.json(movies)
})

// path-to-regexp
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (!movie) return res.status(404).json({ message: 'Movie not found' })
  res.json(movie)
})

app.post('/movies', (req, res) => {
  const validationResults = validateMovieSchema(req.body)

  const movieAlreadyExists = movies.some(
    movie =>
      movie.title === validationResults.data.title &&
      movie.year === validationResults.data.year &&
      movie.director === validationResults.data.director &&
      JSON.stringify(movie.genre) ===
        JSON.stringify(validationResults.data.genre) &&
      movie.poster === validationResults.data.poster &&
      movie.duration === validationResults.data.duration &&
      movie.rate === validationResults.data.rate
  )

  if (movieAlreadyExists) {
    return res.status(409).json({ message: 'Movie already exists' })
  }

  if (validationResults.error) {
    // 422: Unprocessable Entity
    return res
      .status(422)
      .json({ error: JSON.parse(validationResults.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(), // UUID v4
    ...validationResults.data
  }

  // The following code breaks the concept of immutability of the REST architecture
  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const validationResults = validatePartialMovieSchema(req.body)

  if (!validationResults.success) {
    return res
      .status(400)
      .json({ error: JSON.parse(validationResults.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updatedMovie = {
    ...movies[movieIndex],
    ...validationResults.data
  }

  movies[movieIndex] = updatedMovie

  return res.json(updatedMovie)
})

app.delete('/movies/:id', (req, res) => {
  const ORIGIN = req.header('origin')
  if (ALLOWED_ORIGINS.includes(ORIGIN) || !ORIGIN) {
    res.header('Access-Control-Allow-Origin', ORIGIN)
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.status(200).json({ message: 'Movie deleted' })
})

app.options('/movies/:id', (req, res) => {
  const ORIGIN = req.header('origin')
  if (ALLOWED_ORIGINS.includes(ORIGIN) || !ORIGIN) {
    res.header('Access-Control-Allow-Origin', ORIGIN)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  }
  res.send(204)
})

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
)
