const router = require('express').Router();
const { validateToken } = require('../Controller/UserController');
const { pannaAdd, pannalist } = require("../Controller/Pannacontroller");
const { SangamAdd, GameRateAdd } = require("../Controller/sanagam");

router.post("/add", validateToken, pannaAdd);
router.post("/sangamadd", validateToken, SangamAdd);
router.post("/gamerate", GameRateAdd);

router.get("/list", validateToken, pannalist);

module.exports = router;
