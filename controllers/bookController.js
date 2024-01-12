const Book = require("../models/bookModel");

const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "likes";

    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ [sortBy]: 1 })
      .skip(skip)
      .limit(limit);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likeBook = async (req, res) => {
  const bookId = req.params.id;
  const loggedInAuthorId = req.user._id;

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found." });

    if (book.likes.includes(loggedInAuthorId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this book." });
    }

    book.likes.push(loggedInAuthorId);
    await book.save();

    res.json({ message: "Book liked successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unlikeBook = async (req, res) => {
  const bookId = req.params.id;
  const loggedInAuthorId = req.user._id;

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found." });

    if (!book.likes.includes(loggedInAuthorId)) {
      return res.status(400).json({ message: "You have not liked this book." });
    }

    book.likes = book.likes.filter((authorId) => authorId !== loggedInAuthorId);
    await book.save();

    res.json({ message: "Book unliked successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const publishBook = async (req, res) => {
  const { title, author, content } = req.body;

  try {
    const newBook = new Book({
      title,
      author,
      content,
    });

    const savedBook = await newBook.save();

    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBooks,
  likeBook,
  unlikeBook,
  publishBook,
};
