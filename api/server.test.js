const request = require('supertest');
const server = require('./server');

test('POST /api/auth/register - successfully registers a new user', async () => {
  const response = await request(server)
    .post('/api/auth/register')
    .send({ username: 'newUser', password: 'password123' });

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  expect(response.body).toHaveProperty('username', 'newUser');
});

test('POST /api/auth/register - fails without username and password', async () => {
  const response = await request(server)
    .post('/api/auth/register')
    .send({ username: '' });

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('message', 'username and password required');
});

test('POST /api/auth/login - successfully logs in with valid credentials', async () => {
  const response = await request(server)
    .post('/api/auth/login')
    .send({ username: 'newUser', password: 'password123' });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message', 'welcome, newUser');
  expect(response.body).toHaveProperty('token');
});

test('POST /api/auth/login - fails with invalid credentials', async () => {
  const response = await request(server)
    .post('/api/auth/login')
    .send({ username: 'newUser', password: 'wrongPassword' });

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('message', 'invalid credentials');
});

test('GET /api/jokes - successfully retrieves jokes with token', async () => {
  // First log in to get the token
  const login = await request(server)
    .post('/api/auth/login')
    .send({ username: 'newUser', password: 'password123' });

  const token = login.body.token;

  // Use the token to access the jokes route
  const response = await request(server)
    .get('/api/jokes')
    .set('Authorization', token);

  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array); // Assuming jokes are returned in an array
});

test('GET /api/jokes - fails to retrieve jokes without token', async () => {
  const response = await request(server)
    .get('/api/jokes');

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('message', 'token required');
});
