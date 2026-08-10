var express = require("express");
const {
  registerUser,
  loginUser,
  currentUserData,
  followUser,
  unFollowUser,
  adminBlock,
  adminUnBlock,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
var router = express.Router();

//Registration of the User
router.post("/register", registerUser);

//Authentication of the User
router.post("/login", loginUser);

//authorization of the routes using this verify token middleware
router.use(auth.verifyToken);

//Get current user Data
router.get("/currentUserData", currentUserData);

//Follow user
router.get("/follow/:id", followUser);

//Unfollow User
router.get("/unfollow/:id", unFollowUser);

//Block User by Administrator
router.get("/block/:name", adminBlock);

//Unblock user by Administrator
router.get("/unblock/:name", adminUnBlock);

module.exports = router;
