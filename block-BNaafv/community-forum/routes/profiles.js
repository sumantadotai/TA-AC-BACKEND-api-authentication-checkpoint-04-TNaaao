var express = require("express");
const { getProfileInfo } = require("../controllers/profileController");
const { verifyAuthToken } = require("../middleware/auth");
var router = express.Router();

app.use(verifyAuthToken);

//Get profile Info
router.get("/:username", getProfileInfo);

//Update profile Info
router.put("/:username", updatedProfile);

module.exports = router;
