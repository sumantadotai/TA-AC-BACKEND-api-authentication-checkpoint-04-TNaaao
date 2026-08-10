const Answer = require("../models/Answer");
const Profile = require("../models/Profile");
const Question = require("../models/Question");
const User = require("../models/User");
const Comment = require("../models/Comment");

let updateAnswer = async (req, res, next) => {
  let answerId = req.params.answerId;
  let data = req.body;
  let loggedUser = req.user;

  try {
    let answer = await Answer.findById(answerId).populate("author");

    if (loggedUser.username === answer.author.username) {
      let updatedAnswer = await Answer.findByIdAndUpdate(answerId, data);

      return res.json({ answer: updatedAnswer });
    } else {
      return res.json({ error: "only author of answer can edit it" });
    }
  } catch (error) {
    next(error);
  }
};

let deletedAnswer = async (req, res, next) => {
  let answerId = req.params.answerId;

  let loggedUser = req.user;

  try {
    let answer = await Answer.findById(answerId).populate("author");

    if (loggedUser.username === answer.author.username) {
      let deletedAnswer = await Answer.findByIdAndDelete(answerId);

      let updatedQuestion = await Question.findByIdAndUpdate(
        deletedAnswer.questionId,
        { $pull: { answers: deletedAnswer.id } }
      );

      let updatedUser = await User.findOneAndUpdate(
        { username: loggedUser.username },
        { $pull: { answers: deletedAnswer.id } }
      );

      return res.json({ answer: deletedAnswer });
    } else {
      return res.json({ error: "only author of answer can delete it" });
    }
  } catch (error) {
    next(error);
  }
};

let upVotedAnswer = async (req, res, next) => {
  let answerId = req.params.id;
  try {
    let loggedProfile = await Profile.findOne({ username: req.user.username });

    let updatedAnswer = await Answer.findByIdAndUpdate(answerId, {
      $inc: { upvoteCount: 1 },
      $push: { upvotedBy: loggedProfile.id },
    });

    let updatedProfile = await Profile.findByIdAndUpdate(loggedProfile.id, {
      $push: { upvotedAnswers: updatedAnswer.id },
    });

    return res.json({ answer: updatedAnswer });
  } catch (error) {
    next(error);
  }
};

let downVoteAnswer = async (req, res, next) => {
  let answerId = req.params.id;
  try {
    let loggedProfile = await Profile.findOne({
      username: req.user.username,
    });

    let updatedAnswer = await Answer.findByIdAndUpdate(answerId, {
      $inc: { upvoteCount: -1 },
      $pull: { upvotedBy: loggedProfile.id },
    });

    let updatedProfile = await Profile.findByIdAndUpdate(loggedProfile.id, {
      $pull: { upvotedAnswers: updatedAnswer.id },
    });

    return res.json({ answer: updatedAnswer });
  } catch (error) {
    next(error);
  }
};

let commentOnAnswer = async (req, res, next) => {
  let loggedProfile = req.user;
  let answerId = req.params.id;

  let data = req.body;
  try {
    let profile = await Profile.findOne({ username: loggedProfile.username });

    data.author = profile.id;
    data.answerId = answerId;
    let comment = await Comment.create(data);

    let updatedAnswer = await Answer.findByIdAndUpdate(answerId, {
      $push: { comments: comment.id },
    });

    let updatedProfile = await Profile.findByIdAndUpdate(profile.id, {
      $push: { comments: comment.id },
    });

    return res.json({ comment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateAnswer,
  deletedAnswer,
  upVotedAnswer,
  downVoteAnswer,
  commentOnAnswer,
};
