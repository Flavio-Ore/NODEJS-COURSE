import { requireJSON } from '../utils.js'

// Instead of using the requireJSON function from the utils.js file, nodejs gonna implement "with" to import the json file as follows:
// import movies from './../json/movie.api.json' with assert: { type: 'json' }
const movies = requireJSON('./../json/movie.api.json')

export class MovieModel {
  static async getAll ({ genre } = {}) {
    if (genre) {
      return movies.filter(movie =>
        movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }
    return movies
  }

  static async getById ({ id }) {
    return movies.find(movie => movie.id === id)
  }

  static async create ({ shape }) {
    const newMovie = {
      id: crypto.randomUUID(),
      ...shape
    }

    // The following code breaks the concept of immutability of the REST architecture
    movies.push(newMovie)

    return newMovie
  }

  static async update ({ id, shape }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false

    const updatedMovie = {
      ...movies[movieIndex],
      ...shape
    }

    movies[movieIndex] = updatedMovie

    return updatedMovie
  }

  static async delete ({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false
    movies.splice(movieIndex, 1)
    return true
  }
}
