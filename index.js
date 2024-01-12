const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const faker = require("@faker-js/faker/locale/en");
const Author = require("./models/authorModel");
const Book = require("./models/bookModel");
const {
  registerAuthor,
  loginAuthor,
  getAllAuthors,
  getAuthorById,
  getLoggedInAuthor,
} = require("./controllers/authController");
const {
  getAllBooks,
  likeBook,
  unlikeBook,
} = require("./controllers/bookController");
const authenticationMiddleware = require("./middleware/authentication");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error.message);
  });

const generateMockData = async () => {
  try {
    await Author.deleteMany({});
    await Book.deleteMany({});

    const authors = Array.from({ length: 5 }, () => ({
      name: faker.faker.person.fullName(),
      email: faker.faker.internet.email(),
      phone_no: faker.faker.phone.number(),
      password: faker.faker.string.alpha(),
    }));

    const createdAuthors = await Author.create(authors);

    const books = Array.from({ length: 15 }, () => ({
      title: faker.faker.lorem.words(),
      likes: faker.faker.number.int({ min: 0, max: 100 }),
      author: faker.faker.helpers.arrayElement(createdAuthors),
    }));

    await Book.create(books);

    console.log("Mock data generated successfully!");
  } catch (error) {
    console.error("Error generating mock data:", error.message);
  }
};
generateMockData();

app.use(authenticationMiddleware);

app.post("/register", registerAuthor);
app.post("/login", loginAuthor);
app.get("/authors", getAllAuthors);
app.get("/authors/:id", getAuthorById);
app.get("/authors/me", getLoggedInAuthor);

app.get("/books", getAllBooks);
app.put("/books/like/:id", likeBook);
app.put("/books/unlike/:id", unlikeBook);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
