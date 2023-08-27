const express = require('express');
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const app = express();
app.use(express.json());

const initializeDbAndServer = async () => {
   try {
      db = await open({
         filename: dbPath,
         driver: sqlite3.Database,

      });
      app.listen(3000, () => {
         console.log("Server Running at http://localhost:3000/");

      });
   } catch (e) {
      console.log(`DB Error: ${e.message}`);
      process.exit(1);
   }
};
initializeDbAndServer();


//Get All players
app.get("/players/", async (request, response) => {
   const getPlayersQuery = `
   SELECT 
   * 
   FROM 
   cricket_team
   ORDER BY 
   player_id;`;
   const playersArray = await db.all(getPlayersQuery);
   response.send(playersArray);

});

//ADD Player
app.post("/players/", async (request, response) => {
   const playerDetails = request.body;
   const { playerName, jerseyNumber, role } = playerDetails;
   const addPlayerQuery = `
   INSERT INTO cricket_team(player_name,jersey_number,role)
   VALUES(
      '${playerName}',
      '${jerseyNumber}',
      '${role}'
   );`;

   const dbResponse = await db.run(addPlayerQuery);
   const playerId = dbResponse.lastID;
   response.send({ playerId: playerId });
   response.send("Player Added to Team");
});
//Get Player 
app.get("/players/:playerId", async (request, response) => {
   const { playerId } = request.params;
   const getPlayerQuery = `
      SELECT * FROM cricket_team 
      WHERE player_id = ${playerId};`;
   const playersArray = await db.all(getPlayerQuery);
   response.send(playersArray);
});

//UPDATE player
app.put("/players/:playerId", async (request, response) => {
   const playerDetails = request.body;
   const { playerId } = request.params;
   const { playerName, jerseyNumber, role } = playerDetails;
   const updatePlayerQuery = `
   UPDATE cricket_team 
   SET 
      '${playerName}',
      '${jerseyNumber}',
      '${role}'
       WHERE player_id = ${playerId};`;
   await db.run(updatePlayerQuery);
   response.send("Player Details Updated")

});

//DELETE player
app.delete("/players/:playerId", async (request, response) => {
   const { playerId } = request.params;
   const deletePlayerQuery = `
   DELETE FROM cricket_team 
       WHERE player_id = ${playerId};`;
   await db.run(deletePlayerQuery);
   response.send("Player Removed")

});

module.exports = app;

