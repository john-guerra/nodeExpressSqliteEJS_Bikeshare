let express = require("express");
let router = express.Router();

const { getTrips, getTrip } = require("../db/dbConnector_Sqlite.js");

/* GET home page. */
router.get("/", async function (req, res) {
  try {
    const trips = await getTrips();
    console.log("route / called  -  trips.length", trips.length);
    res.render("index", {  trips, err: null });
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("index", {
      trips: [],
      err: `Error executing SQL ${exception}`,
    });
  }
});

router.get("/trips/:ride_id/edit", async function (req, res) {
  console.log("Edit route", req.params.ride_id);

  try {
    const sqlRes = await getTrip(req.params.ride_id);
    console.log("trips edit found trip", sqlRes);

    if (sqlRes.length > 0) {
      res.render("trips_edit", { trip: sqlRes[0], err: null });
    } else {
      res.render("trips_edit", {
        trip: null,
        err: "Error finding the ride = " + req.params.ride_id,
      });
    }
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("trips_edit", {
      trip: null,
      err: `Error executing SQL ${exception}`,
    });
  }
});

module.exports = router;
