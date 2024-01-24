import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '123456',
  database: 'nodejs_course_moviesdb'
}

const connection = await mysql.createConnection(config)
export class MovieModel {
  static async getGenre ({ genre }) {
    const [name] = await connection.query(
      'SELECT id, name FROM GENRES WHERE LOWER(name) = ?;',
      [genre.toLowerCase()]
    )

    return name[0]
  }

  static async getAll ({ genre } = {}) {
    if (!genre) {
      const [movies] = await connection.query(
        'SELECT BIN_TO_UUID(id) id, title, year, director, duration, post, rate FROM MOVIES'
      )

      return await Promise.all(
        movies.map(async ({ id }) => await this.getById({ id }))
      )
    }

    const { id: genreId } = await this.getGenre({ genre })
    if (!genreId) return []

    const [moviesIds] = await connection.query(
      'SELECT BIN_TO_UUID(movie_id) id FROM MOVIES_GENRES WHERE genre_id = ?;',
      [genreId]
    )
    if (moviesIds.length === 0) return []

    return await Promise.all(
      moviesIds.map(async ({ id }) => await this.getById({ id }))
    )
  }

  static async getById ({ id }) {
    const [movie] = await connection.query(
      'SELECT BIN_TO_UUID(id) id, title, year, director, duration, post, rate FROM MOVIES WHERE BIN_TO_UUID(id) = ?;',
      [id]
    )

    if (movie.length === 0) return undefined

    const [genres] = await connection.query(
      'SELECT name FROM MOVIES M INNER JOIN GENRES G INNER JOIN MOVIES_GENRES MG ON M.id=MG.movie_id AND G.id=MG.genre_id WHERE BIN_TO_UUID(movie_id) = ?;',
      [id]
    )

    if (genres.length === 0) return []

    movie[0].genres = genres.map(({ name }) => name)

    return movie[0]
  }

  static async create ({ shape }) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      rate,
      genre: genres
    } = shape
    const [UUIDResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = UUIDResult
    try {
      for (const name of genres) {
        if (!(await this.getGenre({ genre: name }))) return []
      }

      await connection.query(
        'INSERT INTO MOVIES (id, title, year, director, duration, post, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);',
        [uuid, title, year, director, duration, poster, rate]
      )

      for (const name of genres) {
        await connection.query(
          'INSERT INTO MOVIES_GENRES (movie_id, genre_id) VALUES (UUID_TO_BIN(?), (SELECT id FROM GENRES WHERE name = ?));',
          [uuid, name]
        )
      }
    } catch (error) {
      // Try to avoid showing the error message to the user
      throw new Error(error.message)
    }

    return await this.getById({ id: uuid })
  }

  // todo
  static async update ({ id, shape }) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      rate,
      genre: genres
    } = shape

    const updateMovie = async ({ row, data, movieId = id }) => {
      await connection.query(
        `UPDATE MOVIES SET ${row} = ? WHERE BIN_TO_UUID(id) = ?;`,
        [data, movieId]
      )
    }

    try {
      if (title) await updateMovie({ row: 'title', data: title })

      if (year) await updateMovie({ row: 'year', data: year })

      if (director) await updateMovie({ row: 'director', data: director })

      if (duration) await updateMovie({ row: 'duration', data: duration })

      if (poster) await updateMovie({ row: 'post', data: poster })

      if (rate) await updateMovie({ row: 'rate', data: rate })

      if (genres) {
        for (const genre of genres) {
          if (!(await this.getGenre({ genre }))) return []
        }

        for (const name of genres) {
          await connection.query(
            'UPDATE MOVIES_GENRES SET genre_id = (SELECT name FROM GENRES WHERE name = ?), WHERE BIN_TO_UUID(movie_id) = ?));',
            [name, id]
          )
        }
      }
    } catch (error) {
      // Try to avoid showing the error message to the user
      throw new Error(error.message)
    }

    return await this.getById({ id })
  }

  static async delete ({ id }) {
    const [movie] = await connection.query(
      'SELECT BIN_TO_UUID(id) id FROM MOVIES WHERE BIN_TO_UUID(id) = ?;',
      [id]
    )

    if (movie.length === 0) return undefined

    await connection.query(
      'DELETE FROM MOVIES_GENRES WHERE BIN_TO_UUID(movie_id) = ?;',
      [id]
    )
    await connection.query('DELETE FROM MOVIES WHERE BIN_TO_UUID(id) = ?;', [
      id
    ])

    return movie[0]
  }
}
