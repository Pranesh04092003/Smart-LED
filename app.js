const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const lightRoutes = require("./routes/lightRoutes");
const hardwareRoutes = require("./routes/hardwareRoutes");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/led", lightRoutes);
app.use("/hardware", hardwareRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found." });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
});

module.exports = app;
