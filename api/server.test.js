const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig'); // Adjust path as necessary

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

describe('Auth Endpoints', () => {
  it('should register a new user successfully', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Captain Marvel', password: 'foobar' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', 'Captain Marvel');
  });

  it('should not register a user without a username or password', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: '', password: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'username and password required');
  });

  it('should login successfully and return a token', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'Iron Man', password: 'foobar' });

    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'Iron Man', password: 'foobar' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('message', 'welcome, Iron Man');
  });

  it('should return invalid credentials for wrong username or password', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'NonExistentUser', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'invalid credentials');
  });
});

describe('Jokes Endpoint', () => {
  it('should return jokes if token is provided', async () => {
    const registerRes = await request(server)
      .post('/api/auth/register')
      .send({ username: 'Spiderman', password: 'foobar' });

    const loginRes = await request(server)
      .post('/api/auth/login')
      .send({ username: 'Spiderman', password: 'foobar' });

    const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', loginRes.body.token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it('should not return jokes without a token', async () => {
    const res = await request(server).get('/api/jokes');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'token required');
  });
});