const router = require('express').Router();

const Panna = require("../Controller/Pannacontroller")
const validateToken = require('../Controller/UserController')



router.post("/add", validateToken ,Panna.pannaAdd)
router.get("/list", Panna.pannalist)



module.exports = router
