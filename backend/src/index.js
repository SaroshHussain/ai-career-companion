// Application entry point.
// Loads environment variables from .env, then starts the Express server.
// This is the file referenced in the "dev" and "start" npm scripts.

import 'dotenv/config'
import app from './app.js'
import config from './config/index.js'

const { port, nodeEnv } = config

app.listen(port, () => {
  console.log(`Server running in ${nodeEnv} mode on http://localhost:${port}`)
})
