var express = require("express");
const {
  newQuestion,
  getAllQuestions,
  updateQuestionById,
  deleteQuestionBySlug,
  createAnswer,
  listAllAnswer,
  upVoteQuestion,
  downVoteQuestion,
  createComment,
} = require("../controllers/questionController");
const auth = require("../middlewares/auth");

var router = express.Router();
router.use(auth.verifyToken);

//Create  a new Question
router.post("/", newQuestion);

//Get All the Questions
router.get("/", getAllQuestions);

//Update Question using Id
router.put("/:id", updateQuestionById);

//Delete question using the slug
router.delete("/:slug", deleteQuestionBySlug);

//Create New Answer
router.post("/:questionId/answers", createAnswer);

//Get All the List of Answers
router.get("/:questionId/answers", listAllAnswer);

//Upvote the Question
router.get("/upvote/:id", upVoteQuestion);

//Delete the Upvote of the question
router.get("/removeupvote/:id", downVoteQuestion);

//Create a Comment on your question
router.post("/comment/:questionId", createComment);

module.exports = router;
