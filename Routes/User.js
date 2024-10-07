const router = require("express").Router();
const { validateToken, signup, login, getotpsingup, userlist, user,updateUserStatus, resetMpin } = require("../Controller/UserController");

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

router.post("/update-status", updateUserStatus)

router.post("/reset-mpin", resetMpin)


module.exports = router;
