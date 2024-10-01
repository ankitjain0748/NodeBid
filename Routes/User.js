const router = require('express').Router();

const usercontroller= require("../Controller/UserController")

router.post("/singup", usercontroller.signup);


module.exports = router