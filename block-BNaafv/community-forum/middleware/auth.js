var jwt = require("jsonwebtoken");

let verifyAuthToken = async (req, res, next) => {
  var token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ error: "token required" });
  }
  try {
    var payload = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

let authorizeOptionals = async (req, res, next) => {
  let token = req.headers.authorization;
  try {
    if (token) {
      let payload = await jwt.verify(token, process.env.SECRET);
      req.user = payload;
      return next();
    } else {
      return next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyAuthToken,
  authorizeOptionals,
};
