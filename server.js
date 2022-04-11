"use-strict";
const express = require("express");
const cors = require("cors");
const app = express();
const https = require("https");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

app.use(
  cors({
    origin: ["http://localhost:5000"],
  }),
);
app.use(express.json());

app.use(express.static(__dirname + "/build"));

app.get("*", function (req, res) {
  res.sendFile(__dirname + "/build/index.html");
});

const run = async (port) => {
  console.log("attempting to listen on ", port);
  app.listen(port, () => {
    console.log(`App is running on port ${port}`);
  });
};

run(process.env.PORT || 4444).catch((err) => {
  console.log(`Error running node: ${err}`);
  throw err;
});
