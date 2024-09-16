const bcrypt = require('bcryptjs');
const Users = require('../users/user-model');

async function invalidCred(req, res, next) {
  const { username, password } = req.body;
  try {
    // Find user by username
    const user = await Users.findBy({ username }).first();

    // Check if user exists and password is correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If everything is valid, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error occurred while handling invalid credentials:", error);
    res.status(500).json({ message: "Server error while handling invalid credentials" });
  }
}

module.exports = invalidCred;
