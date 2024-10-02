const router = require('express').Router();
const { validateToken } = require('../Controller/UserController');
const { pannaAdd, pannalist } = require("../Controller/Pannacontroller");

// Route to add a new Panna record
router.post("/add", pannaAdd);

// Route to list all Panna records
router.get("/list", pannalist);

module.exports = router;
