const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Book = require("./bookModel");

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_no: { type: String, required: true },
  password: { type: String, required: true },
  books: { type: Number, default: 0 },
});

authorSchema.pre("save", async function (next) {
  const author = this;

  if (!author.isModified("password")) return next();

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(author.password, saltRounds);
    author.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

let initialUpdateDone = false;

authorSchema.post("save", async function (doc, next) {
  try {
    console.log("Author ID:", doc._id);

    const authorIdString = doc._id.toString();

    const books = await Book.find({ author: authorIdString });

    console.log("Books for Author:", books);

    const bookCount = books.length;

    console.log("Book Count:", bookCount);

    if (bookCount > 0) {
      doc.books = bookCount;

      if (!initialUpdateDone) {
        await doc.save();
        initialUpdateDone = true;

        console.log("Book count updated successfully!");
      }
    }

    next();
  } catch (error) {
    console.error("Error updating book count:", error);
    next(error);
  }
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
