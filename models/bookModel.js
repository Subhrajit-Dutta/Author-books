const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  likes: { type: Number, default: 0 },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
