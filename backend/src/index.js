// Application entry point.
// Loads environment variables from .env, connects to MongoDB, then starts
// the Express server. This is the file referenced in the "dev" and "start"
// npm scripts.

import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'
import config from './config/index.js'

const { port, nodeEnv, mongoUri } = config

async function start() {
  // Connect to MongoDB before accepting requests so the API never serves
  // traffic without a database. If MONGODB_URI is missing we log a warning
  // and boot anyway (useful for local-only development).
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri)
      console.log('MongoDB connected')
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err.message)
      process.exit(1)
    }
  } else {
    console.warn('MONGODB_URI is not set — running without a database.')
  }

  app.listen(port, () => {
    console.log(`Server running in ${nodeEnv} mode on http://localhost:${port}`)
  })
}

start()
