const http = require("http");
require("dotenv").config();
const app = require("./app");
// const mongoose = require("mongoose");

//
// const MONGO_URL =
//   "mongodb+srv://dudzon:aCQIhhWzRK8e31gw@nasacluster.xigdp.mongodb.net/nasa?retryWrites=true&w=majority";

const server = http.createServer(app);

const { mongoConnect } = require("./services/mongo");

// mongoose.connection.once("open", () => {
//   console.log("Mongo db , connection is ready");
// });
// mongoose.connection.on("error", (err) => {
//   console.error(err);
// });
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");
const PORT = process.env.PORT || 8000;
async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(PORT, "port");
  });
}

startServer();
