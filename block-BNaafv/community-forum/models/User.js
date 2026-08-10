var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, unique: true, require: true },
  name: { type: String },
  bio: { type: String },
  image: { type: String },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  questions: [{ type: mongoose.Types.ObjectId, ref: "Question" }],
  answers: [{ type: mongoose.Types.ObjectId, ref: "Answer" }],
  upvotedQuestions: [{ type: mongoose.Types.ObjectId, ref: "Question" }],
  upvotedAnswers: [{ type: mongoose.Types.ObjectId, ref: "Answer" }],
  comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
});

userSchema.pre("save", async function (next) {
  try {
    if (this.password && this.isModified("password")) {
      let result = await bcrypt.hash(this.password, 10);
      this.password = result;
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.signToken = async function () {
  let payload = {
    userId: this.id,
    email: this.email,
    username: this.username,
    name: this.name,
  };
  try {
    let token = await jwt.sign(payload, process.env.SECRET);
    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userJSON = async function () {
  var data = {
    name: this.name,
    username: this.username,
    bio: this.bio,
    image: this.image,
    isAdmin: this.isAdmin,
    isBlocked: this.isBlocked,
  };
  return data;
};

module.exports = mongoose.model("User", userSchema);
