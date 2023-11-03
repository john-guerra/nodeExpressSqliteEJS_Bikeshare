let express = require("express");
let router = express.Router();

const { getTrips } = require("../db/dbConnector_Sqlite.js");

/* GET home page. */
router.get("/", async function (req, res) {
  try {
    const trips = await getTrips();
    console.log("route / called  -  trips.length", trips.length);
    res.render("index", { title: "SF BikeShare Rides", trips, err: null });
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("index", {
      title: "SF BikeShare Rides",
      trips: [],
      err: `Error executing SQL ${exception}`,
    });
  }
});

module.exports = router;
