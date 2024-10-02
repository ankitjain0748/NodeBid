const router = require("express").Router();
const { validateToken, signup, login, getotpsingup, userlist, user } = require("../Controller/UserController");

// User Signup Route
router.post("/signup", signup);

// OTP Verification Route
router.post("/getotp", getotpsingup);

// User Login Route
router.post("/login", login);

// List Users Route (Requires Authentication)
router.get("/list", userlist);

// Get User Information Route (Requires Authentication)
router.get("/", validateToken, user);

module.exports = router;
