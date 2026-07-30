// Express application setup.
// Configures middleware (CORS, JSON parsing) and mounts all route
// groups under /api. The app object is exported so the entry point
// (index.js) only handles server startup.

import express from 'express'
import cors from 'cors'
import config from './config/index.js'
import healthRoutes from './routes/health.js'
import resumeRoutes from './routes/resume.js'
import aiRoutes from './routes/ai.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

// ----- Middleware -----

// Enable CORS so the Vite dev server (or any allowed origin) can call the API.
app.use(cors({
  origin: config.clientOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}))

// Parse incoming JSON request bodies (limit raised for resume uploads).
app.use(express.json({ limit: '10mb' }))

// Parse URL-encoded bodies.
app.use(express.urlencoded({ extended: true }))

// ----- Routes -----

// All API routes are namespaced under /api.
app.use('/api', healthRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api', aiRoutes)

// ----- Error handling -----

// Catch 404s for undefined routes.
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler (must be last).
app.use(errorHandler)

export default app
