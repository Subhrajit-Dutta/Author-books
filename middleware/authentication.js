const jwt = require("jsonwebtoken");
const Author = require("../models/authorModel");
require("dotenv").config();

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.error("Error decoding token:", err);
      return res
        .status(401)
        .json({ message: "Invalid token.", error: err.message });
    }

    const { email } = decodedToken;

    try {
      const existingAuthor = await Author.findOne({ email });

      if (!existingAuthor) {
        return res.status(404).json({ message: "Author not found." });
      }

      req.user = existingAuthor;
      next();
    } catch (error) {
      console.error("Error finding author:", error);
      res.status(500).json({ message: error.message });
    }
  });
};

module.exports = authenticateUser;
