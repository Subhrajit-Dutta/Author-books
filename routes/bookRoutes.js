const express = require("express");
const {
  getAllBooks,
  likeBook,
  unlikeBook,
  publishBook,
} = require("../controllers/bookController");
const authenticateUser = require("../middleware/authentication");

const router = express.Router();

router.get("/books", getAllBooks);

router.use(authenticateUser);
router.put("/books/like/:id", likeBook);
router.put("/books/unlike/:id", unlikeBook);
router.post("books/publish", publishBook);

module.exports = router;
