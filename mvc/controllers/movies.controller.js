import { MovieModel } from '../models/movie.model'
import {
  validateMovieSchema,
  validatePartialMovieSchema
} from '../schemas/movie.schema'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    return res.json(movie)
  }

  static async create (req, res) {
    const validationResults = validateMovieSchema(req.body)

    if (!validationResults.success) {
      return res
        .status(422)
        .json({ error: JSON.parse(validationResults.error.message) })
    }

    const movies = await MovieModel.getAll()

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

    const newMovie = await MovieModel.create({ shape: validationResults.data })

    return res.status(201).json(newMovie)
  }

  static async update (req, res) {
    const validationResults = validatePartialMovieSchema(req.body)

    if (!validationResults.success) {
      return res
        .status(400)
        .json({ error: JSON.parse(validationResults.error.message) })
    }

    const { id } = req.params
    const updatedMovie = await MovieModel.update({
      id,
      shape: validationResults.data
    })

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json(updatedMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const movieDeleted = await MovieModel.delete({ id })

    if (movieDeleted === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.status(200).json({ message: 'Movie deleted' })
  }
}
