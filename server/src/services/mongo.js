const mongoose = require("mongoose");

require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("Mongo db , connection is ready");
});
mongoose.connection.on("error", (err) => {
  console.error(err, "Error");
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function disconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, disconnect };
