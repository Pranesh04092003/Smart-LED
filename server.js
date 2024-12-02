const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let ledState = {
  state: false,
  brightness: 0,
};

let hardwareStatus = {
  online: false,
  lastActive: 0, // Timestamp of the last heartbeat received
};

const HEARTBEAT_TIMEOUT = 10000; // Timeout duration to consider the hardware offline (in ms)

// Endpoint to get the LED state and hardware status
app.get("/led", (req, res) => {
  const currentTime = Date.now();

  // Determine if the hardware is online based on the last heartbeat
  hardwareStatus.online = currentTime - hardwareStatus.lastActive <= HEARTBEAT_TIMEOUT;

  // Ensure brightness is 0 if LED is off
  if (!ledState.state) {
    ledState.brightness = 0;
  }

  res.json({ ...ledState, online: hardwareStatus.online });
  console.log(`LED state fetched: ${JSON.stringify(ledState)}, Online: ${hardwareStatus.online}`);
});

// Endpoint to update the LED state (ON/OFF and brightness)
app.post("/led", (req, res) => {
  const { state, brightness } = req.body;

  if (typeof state !== "undefined") {
    ledState.state = state;
    if (!state) {
      ledState.brightness = 0;
    }
  }

  if (typeof brightness !== "undefined" && state) {
    ledState.brightness = brightness;
  }

  res.json({ message: "LED state updated", ledState });
  console.log(`LED updated: ${JSON.stringify(ledState)}`);
});

// Endpoint to receive heartbeat from hardware
app.post("/heartbeat", (req, res) => {
  hardwareStatus.lastActive = Date.now(); // Update last active timestamp
  hardwareStatus.online = true;
  res.json({ message: "Heartbeat received", online: true });
  console.log(`Heartbeat received at ${new Date(hardwareStatus.lastActive).toISOString()}`);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
