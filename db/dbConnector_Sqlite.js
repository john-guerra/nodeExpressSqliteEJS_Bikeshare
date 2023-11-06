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
  try {
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
  } finally {
    await db.close();
  }
}

async function getTrip(ride_id) {
  console.log("Get trip ride_id", ride_id);
  const db = await connect();
  try {
    const stmt = await db.prepare(`SELECT 
    ride_id, 
    start_station_name, 
    end_station_name, 
    started_at, 
    ended_at,
    rideable_type
  FROM trips
  WHERE 
    ride_id = :ride_id    
  `);

    stmt.bind({ ":ride_id": ride_id });

    const trips = await stmt.all();

    await stmt.finalize();

    return trips;
  } finally {
    await db.close();
  }
}

async function updateTrip(ride_id, newRide) {
  console.log("update trip ride_id", ride_id);
  const db = await connect();
  try {
    const stmt = await db.prepare(`UPDATE trips  
    SET
      start_station_name = :start_station_name,
      end_station_name = :end_station_name, 
      started_at = :started_at, 
      ended_at = :ended_at,
      rideable_type = :rideable_type
  WHERE 
    ride_id = :ride_id    
  `);

    stmt.bind({
      ":ride_id": ride_id,
      ":end_station_name": newRide.end_station_name,
      ":start_station_name": newRide.start_station_name,
      ":started_at": newRide.started_at,
      ":ended_at": newRide.ended_at,
      ":rideable_type": newRide.rideable_type,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

async function deleteTrip(ride_id) {
  console.log("update trip ride_id", ride_id);
  const db = await connect();
  try {
    const stmt = await db.prepare(`DELETE FROM trips      
  WHERE 
    ride_id = :ride_id    
  `);

    stmt.bind({
      ":ride_id": ride_id,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}

async function createTrip( newRide) {
  console.log("create trip newRide", newRide);
  const db = await connect();
  try {
    const stmt = await db.prepare(`INSERT INTO trips 
      (start_station_name, end_station_name, started_at, ended_at, rideable_type)
    VALUES
      ( 
        :start_station_name,
        :end_station_name, 
        :started_at, 
        :ended_at,
        :rideable_type
      )
  `);

    stmt.bind({
      ":end_station_name": newRide.end_station_name,
      ":start_station_name": newRide.start_station_name,
      ":started_at": newRide.started_at,
      ":ended_at": newRide.ended_at,
      ":rideable_type": newRide.rideable_type,
    });

    const result = await stmt.run();

    await stmt.finalize();

    return result;
  } finally {
    await db.close();
  }
}


// ******* COMMENTS *********

async function getComments(ride_id) {
  console.log("Get trip ride_id", ride_id);
  const db = await connect();
  try {
    const stmt = await db.prepare(`SELECT 
    ride_id,
    comment_id,
    comment 
  FROM comments
  WHERE 
    ride_id = :ride_id    
  `);

    stmt.bind({ ":ride_id": ride_id });

    const comments = await stmt.all();

    await stmt.finalize();

    return comments;
  } finally {
    await db.close();
  }
}

module.exports = {
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  createTrip,
  getComments,
};
