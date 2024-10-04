const router = require('express').Router();

const withdrawaldata = require("../Controller/Widthwral")
const {validateToken} = require('../Controller/UserController')


router.post("/withdrawal", validateToken, withdrawaldata.withdrawalAdd)
router.post("/success", validateToken, withdrawaldata.successAdd)

router.get("/receive", validateToken, withdrawaldata.amountget)

module.exports = router
