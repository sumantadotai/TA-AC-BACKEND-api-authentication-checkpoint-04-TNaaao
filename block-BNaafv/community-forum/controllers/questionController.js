const Answer = require("../models/Answer");
const Profile = require("../models/Profile");
const Question = require("../models/Question");
const User = require("../models/User");
const Comment = require("../models/Comment");

let newQuestion = async function (req, res, next) {
  let loggedInUser = req.user;
  let data = req.body;

  try {
    let profile = await Profile.findOne({ username: loggedInUser.username });
    data.author = profile.id;
    let question = await Question.create(data);
    res.json({ question });
  } catch (error) {
    next(error);
  }
};
let getAllQuestions = async function (req, res, next) {
  try {
    let questions = await Question.find({});

    res.json({ questions });
  } catch (error) {
    next(error);
  }
};
let updateQuestionById = async function (req, res, next) {
  try {
    let loggedInUser = req.user;
    let data = req.body;
    let questionId = req.params.id;

    let question = await Question.findById(questionId).populate("author");
    if (question.author.username === loggedInUser.username) {
      let updatedQuestion = await Question.findByIdAndUpdate(questionId, data);

      return res.json({ question: updatedQuestion });
    } else {
      return res
        .status(400)
        .json({ error: "only creater of question can edit question" });
    }
  } catch (error) {
    next(error);
  }
};
let deleteQuestionBySlug = async function (req, res, next) {
  let loggedInUser = req.user;
  let slug = req.params.slug;

  try {
    let question = await Question.findOneAndDelete({ slug });

    let updatedUser = await User.findOneAndUpdate(
      { username: loggedInUser.username },
      { $pull: { questions: question.id } }
    );

    res.json({ question });
  } catch (error) {
    next(error);
  }
};
let createAnswer = async (req, res, next) => {
  let questionId = req.params.questionId;
  let loggedInUser = req.user;

  let data = req.body;
  try {
    let profile = await Profile.findOne({ username: loggedInUser.username });

    data.author = profile.id;
    data.questionId = questionId;

    let answer = await Answer.create(data);

    let updatedQuestion = await Question.findByIdAndUpdate(questionId, {
      $push: { answers: answer.id },
    });

    let updatedUser = await User.findOneAndUpdate(
      { username: loggedInUser.username },
      { $push: { answers: answer.id } }
    );

    res.json({ answer });
  } catch (error) {
    next(error);
  }
};
let listAllAnswer = async (req, res, next) => {
  let questionId = req.params.questionId;
  let loggedInUser = req.user;

  try {
    let question = await Question.findById(questionId).populate("answers");

    return res.json({ answers: question.answers });
  } catch (error) {
    next(error);
  }
};
let upVoteQuestion = async (req, res, next) => {
  let questionId = req.params.id;
  try {
    let loggedProfile = await Profile.findOne({ username: req.user.username });

    let updatedQuestion = await Question.findByIdAndUpdate(questionId, {
      $inc: { upvoteCount: 1 },
      $push: { upvotedBy: loggedProfile.id },
    });

    let updatedProfile = await Profile.findByIdAndUpdate(loggedProfile.id, {
      $push: { upvotedQuestions: updatedQuestion.id },
    });

    return res.json({ question: updatedQuestion });
  } catch (error) {
    next(error);
  }
};
let downVoteQuestion = async (req, res, next) => {
  let questionId = req.params.id;
  try {
    let loggedProfile = await Profile.findOne({
      username: req.user.username,
    });

    let updatedQuestion = await Question.findByIdAndUpdate(questionId, {
      $inc: { upvoteCount: -1 },
      $pull: { upvotedBy: loggedProfile.id },
    });

    let updatedProfile = await Profile.findByIdAndUpdate(loggedProfile.id, {
      $pull: { upvotedQuestions: updatedQuestion.id },
    });

    return res.json({ question: updatedQuestion });
  } catch (error) {
    next(error);
  }
};
let createComment = async (req, res, next) => {
  let loggedInProfile = req.user;
  let questionId = req.params.questionId;

  let data = req.body;
  try {
    let profile = await Profile.findOne({ username: loggedInProfile.username });

    data.author = profile.id;
    data.questionId = questionId;
    let comment = await Comment.create(data);

    let updatedQuestion = await Question.findByIdAndUpdate(questionId, {
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
  newQuestion,
  getAllQuestions,
  updateQuestionById,
  deleteQuestionBySlug,
  createAnswer,
  listAllAnswer,
  upVoteQuestion,
  downVoteQuestion,
  createComment,
};
