const router = require('express').Router();

const Panna = require("../Controller/Pannacontroller")
const verifyUserToken = require('../middleware/Auth')


router.post("/add", verifyUserToken ,Panna.pannaAdd)
router.get("/list", Panna.pannalist)



module.exports = router
