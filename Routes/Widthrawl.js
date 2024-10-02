const router = require('express').Router();

const withdrawaldata = require("../Controller/Widthwral")
const validateToken = require('../Controller/UserController')


router.post("/withdrawal", validateToken, withdrawaldata.withdrawalAdd)
router.post("/success", validateToken, withdrawaldata.successAdd)



module.exports = router
