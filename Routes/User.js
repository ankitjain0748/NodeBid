const router =  require("express").Router();


const { validateToken, signup, login, getotpsingup } = require("../Controller/UserController")

router.post("/singup", signup);
router.post("/getotp", getotpsingup);
router.post("/login", login);




module.exports = router