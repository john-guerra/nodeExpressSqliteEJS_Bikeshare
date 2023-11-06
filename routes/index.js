let express = require("express");
let router = express.Router();

const {
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  createTrip,
  getComments,
} = require("../db/dbConnector_Sqlite.js");

/* GET home page. */
router.get("/", async function (req, res) {
  try {
    const trips = await getTrips();
    console.log("route / called  -  trips.length", trips.length);
    res.render("index", { trips, err: null, type: "success" });
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("index", {
      trips: [],
      err: `Error executing SQL ${exception}`,
      type: "danger",
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
      res.render("trips_edit", { trip: sqlRes[0], err: null, type: "success" });
    } else if (sqlRes.length > 1) {
      res.render("trips_edit", {
        trip: sqlRes[0],
        err: "There is more than one ride with that id =" + req.params.ride_id,
        type: "danger",
      });
    } else {
      res.render("trips_edit", {
        trip: null,
        err: "Error finding the ride = " + req.params.ride_id,
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("trips_edit", {
      trip: null,
      err: `Error executing SQL ${exception}`,
      type: "danger",
    });
  }
});

// Render the edit interface
router.get("/trips/:ride_id", async function (req, res) {
  console.log("Trips detail route", req.params.ride_id);

  try {
    const sqlRes = await getTrip(req.params.ride_id);
    const comments = await getComments(req.params.ride_id);
    console.log("trips edit found trip", sqlRes, " comments.length ", comments.length);



    if (sqlRes.length === 1) {

      

      res.render("trips_details", {
        trip: sqlRes[0],
        comments: comments,
        err: null,
        type: "success",
      });
    } else if (sqlRes.length > 1) {
      res.render("trips_details", {
        trip: sqlRes[0],
        comments: comments,
        err: "There is more than one ride with that id =" + req.params.ride_id,
        type: "danger",
      });
    } else {
      res.render("trips_details", {
        trip: null,
        comments: [],
        err: "Error finding the ride = " + req.params.ride_id,
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("trips_details", {
      trip: null,
      comments: [],
      err: `Error executing SQL ${exception}`,
      type: "danger",
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
      res.render("trips_edit", {
        trip: sqlResFind[0],
        err: "Trip modified",
        type: "success",
      });
    } else {
      res.render("trips_edit", {
        trip: null,
        err: "Error updating the ride = " + ride_id,
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("trips_edit", {
      trip: null,
      err: `Error executing SQL ${exception}`,
      type: "danger",
    });
  }
});

// Render the edit interface
router.get("/trips/:ride_id/delete", async function (req, res) {
  console.log("Delete route", req.params.ride_id);

  try {
    const sqlResDelete = await deleteTrip(req.params.ride_id);
    console.log("Delete trip res=", sqlResDelete);
    const trips = await getTrips();
    if (sqlResDelete.changes === 1) {
      res.render("index", { trips, err: "Trip deleted", type: "success" });
    } else {
      res.render("index", {
        trips,
        err: "Error deleting the trip",
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    const trips = await getTrips();
    res.render("index", {
      trips,
      err: "Error executing the SQL",
      type: "danger",
    });
  }
});

// Render the create interface
router.get("/trips/create", async function (req, res) {
  console.log("Create route", req.params.ride_id);

  res.render("trips_create", { err: null, type: "success" });
});

// Actually create the trip
router.post("/trips/create", async function (req, res) {
  console.log("Create route", req.body);

  const newTrip = req.body;

  try {
    const sqlResCreate = await createTrip(newTrip);
    console.log("Updating trip", sqlResCreate);
    const trips = await getTrips();

    if (sqlResCreate.changes === 1) {
      res.render("index", {
        trips,
        err: "Trip created " + sqlResCreate.lastID,
        type: "success",
      });
    } else {
      res.render("trips_create", {
        err: "Error inserting the ride ",
        type: "danger",
      });
    }
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("trips_create", {
      err: "Error inserting the ride " + exception,
      type: "danger",
    });
  }
});

module.exports = router;
