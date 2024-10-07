const router = require('express').Router();
const { validateToken } = require('../Controller/UserController');
const { pannaAdd, pannalist } = require("../Controller/Pannacontroller");
const { SangamAdd } = require("../Controller/sanagam");

router.post("/add", validateToken, pannaAdd);
router.post("/sangam/add", validateToken, SangamAdd);
router.get("/list", validateToken, pannalist);

module.exports = router;
