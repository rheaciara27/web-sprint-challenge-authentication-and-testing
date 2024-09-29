// Write your tests here
const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')
const bcrypt = require('bcryptjs')



beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})

it('[0] sanity check', () => {
  expect(true).not.toBe(false)
})

describe('[POST] /api/auth/register', () => {
  it('[4] creates a new user with correct information', async () => {
    await request(server).post('/api/auth/register').send({ username: 'jose', password: '1234' })
    const jose = await db('users').where('username', 'jose').first()
    expect(jose).toMatchObject({ username: 'jose', })
  })
  it('[8] saves the user with a bcrypted password and not the plain text', async () => {
    await request(server).post('/api/auth/register').send({ username: 'jose', password: '1234' })
    const jose = await db('users').where('username', 'jose').first()
    expect(bcrypt.compareSync('1234', jose.password)).toBeTruthy()
  }, )
})

describe('[POST] /api/auth/login', () => {
  it('[1] responds with the correct message on username and password required', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '' })
    expect(res.body.message).toMatch('username and password required')
  },)
  it('[1] responds with the correct message on invalid credentials', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: '', password: '1234' })
    expect(res.body.message).toMatch('username and password required')
  },)
})
