const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function connect() {
  return open({
    filename: "./db/bikeShare.sqlite3",
    driver: sqlite3.Database,
  });
}

async function getTrips() {
  const db = await connect();
  const trips = await db.all(`SELECT ride_id, 
      start_station_name, 
      end_station_name, 
      started_at, 
      ended_at,
      rideable_type
    FROM  trips
    ORDER BY ride_id DESC
    LIMIT 20;
    `);

  console.log("dbConnector got data", trips.length);

  return trips;
}

async function getTrip(ride_id) {

  console.log("Get trip ride_id", ride_id);
  const db = await connect();

  const stmt = await db.prepare(`SELECT 
    ride_id, 
    start_station_name, 
    end_station_name, 
    started_at, 
    ended_at,
    rideable_type
  FROM trips
  WHERE 
    ride_id = ?
  `);

  const trip = await stmt.all(ride_id);
  
  await stmt.finalize();

  return trip;
}

module.exports = {
  getTrips,
  getTrip,
};
