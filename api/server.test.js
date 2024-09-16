const request = require('supertest');
const server = require('./server'); // Import your Express server


test('sanity', () => {
  expect(true).toBe(true)
})




describe('POST /api/auth/register', () => {
  test('responds with 201', () => {
    const username = `test_user_${Date.now()}`; // Generate a unique username
    return request(server)
      .post('/api/auth/register')
      .send({ username, password: 'chicago' })
      .expect(201);
  });
  test('responds with 400', () => {
    return request(server)
      .post('/api/auth/register')
      .send({ username: 'thanos' }) // Provide username and password
      .expect(400)
  })
})

describe('POST /api/auth/login', () => {
  test('responds with 200', async () => {
    // Create a unique username for testing login
    const username = `test_user_${Date.now()}`;

    // Register the user before attempting to login
    await request(server)
      .post('/api/auth/register')
      .send({ username, password: 'chicago' })
      .expect(201);

    // Attempt login with the registered username
    return request(server)
      .post('/api/auth/login')
      .send({ username, password: 'chicago' })
      .expect(200);
  });

  test('responds with 400', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username: 'thanos' }) // Provide username and password
      .expect(400);
  });
});
