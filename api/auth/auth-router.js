const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../data/dbConfig'); // Adjust path if necessary
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  try {
    const userExists = await db('users').where({ username }).first();
    if (userExists) {
      return res.status(409).json({ message: "username taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const [id] = await db('users').insert({ username, password: hashedPassword });

    res.status(201).json({ id, username, password: hashedPassword });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});



  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

      // Login
      router.post('/login', async (req, res) => {
        const { username, password } = req.body;
      
        if (!username || !password) {
          return res.status(400).json({ message: "username and password required" });
        }
      
        try {
          const user = await db('users').where({ username }).first();
          if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "invalid credentials" });
          }
      
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' });
      
          res.status(200).json({ message: `welcome, ${username}`, token });
        } catch (err) {
          res.status(500).json({ message: "Error logging in", error: err.message });
        }
      });
      
     
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

      module.exports = router;