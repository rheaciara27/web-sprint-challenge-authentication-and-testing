const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

  // Get the token from the Authorization header
  const token = req.headers.authorization;

  // Check if token is missing
  if (!token) {
    return res.status(401).json({ message: 'token required' });
  }

  // Verify the token
  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      // Token is invalid or expired
      return res.status(401).json({ message: 'token invalid' });
    }
    // Token is valid, call next middleware
    next();
  });
};

