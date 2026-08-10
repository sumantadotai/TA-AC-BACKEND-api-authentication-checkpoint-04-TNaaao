const Question = require("../models/Question");
let lodash = require("lodash");

let getTags = async (req, res, next) => {
  try {
    let questions = await Question.find({});
    let arrayOfTags = questions.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);
    arrayOfTags = lodash.flattenDeep(arrayOfTags);
    arrayOfTags = lodash.uniq(arrayOfTags);
    return res.json({ tags: arrayOfTags });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTags };
