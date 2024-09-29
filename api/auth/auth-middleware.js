const User = require('./auth-model')

async function checkUsernameFree(req, res, next) {
  const { username } = req.body;

  if (!username) {
    return next({ status: 400, message: "username and password required" });
  }

  try {
    const user = await User.findBy({ username }).first();
    if (user) {
      return next({ status: 409, message: "username taken" });
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function checkUsernameandPassword(req, res, next) {
 const {username, password } = req.body

  if (!password || !username) {
    next({ status: 400, message: "username and password required"})
  } else {
    next()
  }
}
 async function checkProfileExists(req, res, next) {
  try {
    const { username } = req.body
    const user = await User.findBy({username}).first()

    if (user) {
      req.user = user
      next()
    } else {
      next({ status: 401, message: 'Invalid credentials'})
    }
  } catch(err) {
    next(err)
  }
 }




module.exports = {
  checkUsernameFree,
  checkUsernameandPassword,
  checkProfileExists
}
