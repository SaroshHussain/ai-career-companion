// Basic app-level tests: root route, health check, and unknown-route handling.

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('app basics', () => {
  it('GET / returns status up', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'up' })
  })

  it('GET /health reports a healthy API', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body).toEqual({ success: false, message: 'Route not found' })
  })
})