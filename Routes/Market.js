const router = require('express').Router();

const Marketing = require("../Controller/marketing")

router.post("/marketadd", Marketing.MarketingAdd);
router.get("/marketlist", Marketing.MarketList);
router.post("/marketdelete", Marketing.MarketDelete)




module.exports = router