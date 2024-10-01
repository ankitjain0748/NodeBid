const router =  require("express").Router();


const { validateToken, signup, login, getotpsingup,userlist,user } = require("../Controller/UserController")

router.post("/singup", signup);
router.post("/getotp", getotpsingup);
router.post("/login", login);
router.get("/list", userlist);
router.get("/", validateToken, user);






module.exports = router