const router = require('express').Router();

const Marketing = require("../Controller/marketing")

router.post("/add", Marketing.MarketingAdd);
router.get("/list", Marketing.marketlist);




module.exports = router