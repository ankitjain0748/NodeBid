const router = require("express").Router();
const { validateToken, signup, login, getotpsingup, userlist, user,updateUserStatus, resetMpin, userlistStatus, UserListId, UserListIdDelete, ProfileAdd } = require("../Controller/UserController");
const Profile = require("../Models/Profile");

// User Signup Route
router.post("/signup", signup);

// OTP Verification Route
router.post("/getotp", getotpsingup);

// User Login Route
router.post("/login", login);

// List Users Route (Requires Authentication)
router.get("/list", userlist);

router.get("/list/status", userlistStatus);


// Get User Information Route (Requires Authentication)
router.get("/", validateToken, user);

router.post("/update-status", updateUserStatus)

router.post("/reset-mpin", resetMpin)

router.post("/delete", UserListIdDelete)

router.post("/profile", validateToken, ProfileAdd)

router.get("/profile-get", Profile)



router.get(`/userlist/:id`, UserListId);





module.exports = router;
