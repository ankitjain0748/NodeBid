const { ResultAdd, ResultList } = require("../Controller/ResultController");

const resultroute = require("express").Router();



resultroute.post("/resultadd" , ResultAdd);

resultroute.get("/resultget" , ResultList)



module.exports = resultroute;
