express = require("express");
const auth = require("../middlewares/auth");

const {
  updateAnswer,
  deletedAnswer,
  upVotedAnswer,
  downVoteAnswer,
  commentOnAnswer,
} = require("../controllers/answerController");
var router = express.Router();
router.use(auth.verifyToken);

//Update Answer
router.put("/:answerId", updateAnswer);

//Delete Answer
router.delete("/:answerId", deletedAnswer);

//Upvote Answer
router.get("/upvote/:id", upVotedAnswer);

//Delete the upvote
router.get("/removeupvote/:id", downVoteAnswer);

//Create an new Comment
router.post("/comment/:id", commentOnAnswer);

module.exports = router;
