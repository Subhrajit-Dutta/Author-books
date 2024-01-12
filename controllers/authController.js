const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Author = require("../models/authorModel");
require("dotenv").config();

const registerAuthor = async (req, res) => {
  const { name, email, phone_no, password } = req.body;

  try {
    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return res.status(400).json({ message: "Email already exists." });
    }
  } catch (e) {
    console.log(e);
  }

  Author.create({ name, email, phone_no, password: password })
    .then((newAuthor) => {
      res.json({ authorId: newAuthor._id });
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
};

const loginAuthor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const author = await Author.findOne({ email });
    if (!author) return res.status(404).json({ message: "Author not found." });

    const validPassword = await bcrypt.compare(password, author.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password." });
    const secretkey = process.env.JWT_SECRET;
    console.log(secretkey);
    const token = jwt.sign({ userId: author._id }, secretkey, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "author",
          as: "books",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone_no: 1,
          totalBooks: { $size: "$books" },
        },
      },
    ]);
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAuthorById = async (req, res) => {
  const authorId = req.params.id;
  try {
    const author = await Author.findById(authorId);
    if (!author) return res.status(404).json({ message: "Author not found." });

    res.json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getLoggedInAuthor = async (req, res) => {
  const loggedInAuthorId = req.user._id;
  try {
    const loggedInAuthor = await Author.findById(loggedInAuthorId);
    if (!loggedInAuthor)
      return res.status(404).json({ message: "Author not found." });

    res.json(loggedInAuthor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerAuthor,
  loginAuthor,
  getAllAuthors,
  getAuthorById,
  getLoggedInAuthor,
};
