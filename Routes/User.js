const router = require('express').Router();

const usercontroller= require("../Controller/UserController")

router.post("/singup", usercontroller.signup);
router.post("/getotp", usercontroller.getotpsingup);



module.exports = router