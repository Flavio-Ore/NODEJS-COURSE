import cors from 'cors'
const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5500/api/index.html',
  'http://localhost:5500',
  'http://localhost:3001'
]
export const corsMiddleware = ({ acceptedOrigins = ALLOWED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    }
  })
