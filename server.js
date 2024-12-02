const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let ledState = false; // Current state of the LED (false = OFF, true = ON)

// Endpoint to get the LED state
app.get("/led", (req, res) => {
  res.json({ state: ledState });
});

// Endpoint to update the LED state
app.post("/led", (req, res) => {
  const { state } = req.body;
  ledState = state;
  console.log(`LED State updated to: ${ledState ? "ON" : "OFF"}`);
  res.json({ message: "LED state updated", state: ledState });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
