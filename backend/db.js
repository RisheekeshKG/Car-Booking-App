const mongoose = require("mongoose");
const dot = require("dotenv").config();

function connectDB() {
  mongoose.connect(
    `mongodb+srv://${dot.parsed.USERNAME}:${dot.parsed.PASSWORD}@cluster0.n69njhi.mongodb.net/`,
    { useUnifiedTopology: true, useNewUrlParser: true }
  );

  const connection = mongoose.connection;
  connection.on("connected", () => {
    console.log("Mongo DB Connection Successfull");
  });
  connection.on("error", () => {
    console.log("Mongo DB Connection Error");
  });
}

connectDB();
module.exports = mongoose;
