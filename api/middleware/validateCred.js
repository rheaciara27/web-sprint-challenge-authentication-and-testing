function validateCred(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Both username and password are required" });
    }

    next();
  }

  module.exports = validateCred;