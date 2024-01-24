import {
  validateMovieSchema,
  validatePartialMovieSchema
} from '../schemas/movie.schema.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getAll({ genre })
    res.json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const movie = await this.movieModel.getById({ id })
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    return res.json(movie)
  }

  create = async (req, res) => {
    const validationResults = validateMovieSchema(req.body)

    if (!validationResults.success) {
      return res
        .status(422)
        .json({ error: JSON.parse(validationResults.error.message) })
    }

    const movies = await this.movieModel.getAll()

    const movieAlreadyExists = movies.some(
      movie =>
        movie.title === validationResults.data.title &&
        movie.year === validationResults.data.year &&
        movie.duration === validationResults.data.duration &&
        movie.director === validationResults.data.director &&
        Number(movie.rate) === validationResults.data.rate &&
        movie.post === validationResults.data.poster
    )

    if (movieAlreadyExists) {
      return res.status(409).json({ message: 'Movie already exists' })
    }

    const newMovie = await this.movieModel.create({
      shape: validationResults.data
    })

    return res.status(201).json(newMovie)
  }

  update = async (req, res) => {
    const validationResults = validatePartialMovieSchema(req.body)

    if (!validationResults.success) {
      return res
        .status(400)
        .json({ error: JSON.parse(validationResults.error.message) })
    }

    const { id } = req.params
    const updatedMovie = await this.movieModel.update({
      id,
      shape: validationResults.data
    })

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json(updatedMovie)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const movieDeleted = await this.movieModel.delete({ id })

    if (!movieDeleted) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.status(200).json({ message: 'Movie deleted' })
  }
}
