const router = require('express').Router();

const withdrawaldata = require("../Controller/Widthwral")
const validateToken = require('../Controller/UserController')


router.post("/withdrawal", withdrawaldata.withdrawalAdd)
router.post("/success", withdrawaldata.successAdd)



module.exports = router
