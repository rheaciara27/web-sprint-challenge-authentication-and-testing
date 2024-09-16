const Users = require('../users/user-model');

async function uniqueName(req, res, next) {
  const { username } = req.body;

  try {
    const existingUser = await Users.findBy({ username }).first();
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    next();
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = uniqueName;
