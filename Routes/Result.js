const { ReusltAdd, ResultList } = require("../Controller/ResultController");

const resultroute = require("express").Router();



resultroute.post("/resultadd" , ReusltAdd);

resultroute.get("/resultget" , ResultList)



module.exports = resultroute;
