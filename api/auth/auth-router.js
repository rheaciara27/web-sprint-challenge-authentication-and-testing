const router = require('express').Router();
const bcrypt = require('bcryptjs')
const User = require('./auth-model')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res,next) => {
  try{
    const {username,password} = req.body
    if(!username || !password){
      return res.status(400).json({message: "username and password required"})
    }
    try{
      const existingUser = await User.findBy(username)
      if(existingUser){
        res.status(409).json({message: "username taken"})
      }
    }catch(error){
      next(error)
    }
    const hash = bcrypt.hashSync(password,8)
    const newUser = {username,password:hash}
    console.log(newUser,'newuser')
    
    const createdUser = await User.addUser(newUser)
    console.log(createdUser,'created user')


    res.status(201).json({
      id:createdUser.id,
      username:createdUser.username,
      password: createdUser.password
    })
  }catch(err){
    next(err)
  }
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
});

router.post('/login', async (req, res,next) => {
  try{
    const {username,password} = req.body
    if(!username || !password){
      return res.status(400).json({message:"username and password required"})
    }
    const user = await User.findBy(username)
  


     if(user && bcrypt.compareSync(password,user.password)){
      const token = generateToken(user)
      req.session.user = user
      res.json({
        message: `welcome, ${username}`,
        token: token
      })
    }else {
      return res.status(401).json({message:'invalid credentials'})
    }
  }catch (err){
    next(err)
  }
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
});

function generateToken(user){
  const payload = {
    userId: user.id,
    username: user.username
  }
  const secret = 'secret';
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload,secret,options)
}

module.exports = router;