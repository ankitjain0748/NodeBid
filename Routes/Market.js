const router = require('express').Router();

const Marketing = require("../Controller/marketing")

router.post("/marketadd", Marketing.MarketingAdd);
router.get("/marketlist", Marketing.MarketList);




module.exports = router