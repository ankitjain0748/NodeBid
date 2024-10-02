const router = require('express').Router();

const withdrawaldata = require("../Controller/Widthwral")
const verifyUserToken = require('../middleware/Auth')


router.post("/withdrawal" ,withdrawaldata.withdrawalAdd)
router.post("/success" ,withdrawaldata.successAdd)



module.exports = router
