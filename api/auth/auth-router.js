const router = require('express').Router();
const Users = require('../users/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateCred = require('../middleware/validateCred');
const uniqueName = require('../middleware/uniqueName');
const invalidCred = require('../middleware/invalidCred');
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

require('dotenv').config();

router.post('/register', validateCred, uniqueName, async (req, res) => {
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
    const {username, password} = req.body;

    // const existingUser = await Users.findBy({username}).first();
    // if(existingUser){
    //     res.status(401).json({message: "username taken"})
    // } else {
        const hash = bcrypt.hashSync(password, 8);
        const user = await Users.add({username, password: hash});
        res.status(201).json(user);
    //}


});

router.post('/login', validateCred, invalidCred, async (req, res) => {
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
      const { username } = req.body;

      try {
        // Find user by username
        const user = await Users.findBy({ username }).first();

        // Generate JWT token
        const token = generateToken(user);

        // Return success message and token
        res.status(200).json({
          message: `Welcome, ${user.username}`,
          token
        });
      } catch (error) {
        console.error("Error occurred during login:", error);
        res.status(500).json({ message: "Server error while logging in" });
      }


});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
