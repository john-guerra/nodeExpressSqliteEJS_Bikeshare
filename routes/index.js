let express = require("express");
let router = express.Router();

const { getTrips } = require("../db/dbConnector_Sqlite.js");

/* GET home page. */
router.get("/", async function (req, res) {
  const trips = await getTrips();
  console.log("route / called  -  trips.length", trips.length);
  res.render("index", { title: "SF BikeShare Rides", trips });
});

module.exports = router;
