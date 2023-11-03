let express = require("express");
let router = express.Router();

const {
  getTrips,
  getTrip,
  updateTrip,
} = require("../db/dbConnector_Sqlite.js");

/* GET home page. */
router.get("/", async function (req, res) {
  try {
    const trips = await getTrips();
    console.log("route / called  -  trips.length", trips.length);
    res.render("index", { trips, err: null });
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("index", {
      trips: [],
      err: `Error executing SQL ${exception}`,
    });
  }
});

// Render the edit interface
router.get("/trips/:ride_id/edit", async function (req, res) {
  console.log("Edit route", req.params.ride_id);

  try {
    const sqlRes = await getTrip(req.params.ride_id);
    console.log("trips edit found trip", sqlRes);

    if (sqlRes.length === 1) {
      res.render("trips_edit", { trip: sqlRes[0], err: null });
    } else if (sqlRes.length > 1) {
      res.render("trips_edit", {
        trip: sqlRes[0],
        err: "There is more than one ride with that id =" + req.params.ride_id,
      });
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

// Actually update the trip
router.post("/trips/:ride_id/edit", async function (req, res) {
  console.log("Edit route", req.params.ride_id, req.body);

  const ride_id = req.params.ride_id;
  const newTrip = req.body;

  try {
    const sqlResUpdate = await updateTrip(ride_id, newTrip);
    console.log("Updating trip", sqlResUpdate);

    if (sqlResUpdate.changes === 1) {

      const sqlResFind = await getTrip(req.params.ride_id);
      res.render("trips_edit", { trip: sqlResFind[0], err: "Trip modified", type: "success" });    
    } else {
      res.render("trips_edit", {
        trip: null,
        err: "Error updating the ride = " + ride_id,
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
