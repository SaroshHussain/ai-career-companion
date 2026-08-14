// Auth flow tests. The User model is mocked so no database is required.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import config from '../src/config/index.js'

const { userModelMock } = vi.hoisted(() => ({
  userModelMock: {
    findOne: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('../src/models/User.js', () => ({
  default: userModelMock,
}))

import app from '../src/app.js'

const createdUser = {
  _id: '64b0f0a1b2c3d4e5f6a7b8c9',
  name: 'Test User',
  email: 'test@example.com',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('POST /api/auth/register', () => {
  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'test@example.com' })
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('returns 201 with a token and public user on success', async () => {
    userModelMock.findOne.mockResolvedValue(null)
    userModelMock.create.mockResolvedValue(createdUser)

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.token).toBeTruthy()
    expect(res.body.user).toEqual({
      id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
    })
  })

  it('returns 409 when the email is already registered', async () => {
    userModelMock.findOne.mockResolvedValue({ _id: createdUser._id })

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })

    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
  })
})

describe('POST /api/auth/login', () => {
  it('returns 401 for invalid credentials', async () => {
    userModelMock.findOne.mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({
        ...createdUser,
        password: 'hashed-not-verified',
        comparePassword: vi.fn().mockResolvedValue(false),
      }),
    }))

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('returns a token for valid credentials', async () => {
    userModelMock.findOne.mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({
        ...createdUser,
        password: 'hashed-verified',
        comparePassword: vi.fn().mockResolvedValue(true),
      }),
    }))

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.token).toBeTruthy()
    expect(res.body.user.email).toBe('test@example.com')
  })
})

describe('GET /api/auth/me', () => {
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('returns the authenticated user for a valid token', async () => {
    userModelMock.findById.mockResolvedValue(createdUser)
    const token = jwt.sign({ id: createdUser._id }, config.jwt.secret)

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.user).toEqual({
      id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
    })
  })
})