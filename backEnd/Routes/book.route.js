const express = require("express");
const isAuthenticated = require("../Middleware/isAuthenticated.middleware");
// const {    getABook } = require("../Routes/auth.route");
const isCreator = require("../Middleware/creator.middleware");
const canView = require("../Middleware/view.middleware");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const {
   createBook,
   getPaginatedBooksList,
   getOwnBooks,
   getNonPaginatedBooks,
   getBookCountWithFilter,
   getBookById,
   deleteBookById,
} = require("../services/book.service");
const { USER_ROLES } = require("../db");
// const logger = require("../config/winston.logger");

const saveABook = asyncHandler(async (req, res) => {
   const body = req.body;

   const new_book = {
      author: body.author,
      title: body.title,
      publishedYear: body.publishedYear,
      creator: req.user._id,
   };

   const book = createBook(new_book);
   await book.save();

   logger.info({ book });

   return res.status(200).json({
      book,
   });
});

const editABook = asyncHandler(async (req, res) => {
   const params = req.params;
   const { id } = params;

   if (!id) {
      res.status(400);
      throw new Error("Id is required for the book to edit");
   }

   const potentialBook = await getBookById(id);

   if (!potentialBook) {
      res.status(400);
      throw new Error("Book not found.");
   }

   const body = req.body;

   if (body.author) {
      potentialBook.author = body.author;
   }

   if (body.title) {
      potentialBook.title = body.title;
   }

   if (body.publishedYear) {
      potentialBook.publishedYear = body.publishedYear;
   }

   if (req.user._id !== potentialBook.creator) {
      potentialBook.creator = req.user._id;
   }

   await potentialBook.save();

   logger.info({ potentialBook });

   return res.status(200).json({
      potentialBook,
   });
});

const getAllBooks = asyncHandler(async (req, res) => {
   const roles = req.user.role;
   const hasViewAllPermission =
      roles.filter((r) => r === USER_ROLES.VIEW_ALL).length > 0;
   const hasViewerPermission =
      roles.filter((r) => r === USER_ROLES.VIEWER).length > 0;

   const query = req.query;
   logger.info(query);

   const pageNo = Number(query.page) || 1;
   const pageSize = query.page_size || process.env.PAGINATION_SIZE || 8;
   const new_ = query.new;
   const old_ = query.old;
   logger.info({
      pageNo,
      pageSize,
      new_,
      old_,
   });

   const tenMinutesAgo = new Date();
   tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

   if (hasViewAllPermission) {
      let books = {};
      let count = 0;
      if (Number(new_) === 1) {
         // show books that are created in the last 10 minutes
         const filter = { createdAt: { $gte: tenMinutesAgo, $lt: new Date() } };
         books = await getNonPaginatedBooks(filter);
         count = await getBookCountWithFilter(filter);
      } else if (Number(old_) === 1) {
         // show books that were created 10 or more minutes ago
         const filter = { createdAt: { $lt: tenMinutesAgo } };
         books = await getNonPaginatedBooks(filter);
         count = await getBookCountWithFilter(filter);
      } else {
         books = await getPaginatedBooksList(pageNo, pageSize);
         count = await getBookCountWithFilter();
      }
      return res.status(200).json({ results: books, count: count });
   } else if (hasViewerPermission) {
      const books = await getOwnBooks(req.user._id, pageNo, pageSize);
      const filter = { creator: req.user._id };
      const count = await getBookCountWithFilter(filter);
      return res.status(200).json({ results: books, count: count });
   } else {
      // this should never happen since canView middleware checks this condition
   }
});

const deleteABook = asyncHandler(async (req, res) => {
   const query = req.query;

   const potentialBook = await getBookById(query.id);

   if (!potentialBook) {
      res.status(400);
      throw new Error("This id is invalid");
   }

   const deleteBook = await deleteBookById(query.id);
   logger.info({ deleteBook });

   return res.status(204).json();
});

const getABook = asyncHandler(async (req, res) => {
   const params = req.params;

   const potentialBook = await getBookById(params.id);

   if (!potentialBook) {
      res.status(400);
      throw new Error("This id is invalid");
   }

   return res.status(200).json(potentialBook);
});

router.get("/", isAuthenticated, canView, getAllBooks);
router.get("/:id", isAuthenticated, canView, getABook);
router.post("/", isAuthenticated, isCreator, saveABook);
router.patch("/:id", isAuthenticated, isCreator, editABook);
router.delete("/delete", isAuthenticated, isCreator, deleteABook);

module.exports = router;