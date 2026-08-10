var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  "mongodb://localhost/community-forum",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to MongoDB");
    }
  }
);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var profilesRouter = require("./routes/profiles");
var answersRouter = require("./routes/answers");
var questionsRouter = require("./routes/questions");
var tagsRouter = require("./routes/tags");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/", indexRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/profiles", profilesRouter);
app.use("/api/v1/answers", answersRouter);
app.use("/api/v1/questions", questionsRouter);
app.use("/api/v1/tags", tagsRouter);

module.exports = app;
