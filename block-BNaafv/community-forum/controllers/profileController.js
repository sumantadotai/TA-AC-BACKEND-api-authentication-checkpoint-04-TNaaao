const User = require("../models/User");

let getProfileInfo = async (req, res, next) => {
  let username = req.params.username;
  try {
    let profile = await User.findOne({ username });
    if (!profile) {
      return res.status(400).json({ error: "Invalid Username" });
    }
    res.json({ profile: await profile.profileJSON() });
  } catch (error) {
    next(error);
  }
};

let updatedProfile = async (req, res, next) => {
  let username = req.params.username;
  try {
    let data = req.body;
    let updatedUser = await User.findOneAndUpdate({ username }, data);
    res.json({ profile: await updatedUser.profileJSON() });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfileInfo,
  updatedProfile,
};
