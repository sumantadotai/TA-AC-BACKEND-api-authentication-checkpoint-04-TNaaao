var express = require("express");
const auth = require("../middlewares/auth");
var router = express.Router();
router.use(auth.verifyToken);

//Get all the list of avaialable Tags

router.get("/", getTags);
module.exports = router;
