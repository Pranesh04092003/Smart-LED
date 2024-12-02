const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// LED state object
let ledState = {
  state: false, // LED state (false = OFF, true = ON)
  brightness: 0, // Default brightness (0-255)
};

// Hardware status object
let hardwareStatus = {
  online: false,
  lastPing: null,
};

// Endpoint to get the LED state
app.get("/led", (req, res) => {
  if (!ledState.state) {
    ledState.brightness = 0; // Ensure brightness is 0 if the LED is off
  }

  res.json(ledState);
  console.log(
    `LED state fetched: State - ${ledState.state}, Brightness - ${ledState.brightness}`
  );
});

// Endpoint to update the LED state (ON/OFF and brightness)
app.post("/led", (req, res) => {
  const { state, brightness } = req.body;

  // Update LED state
  if (typeof state !== "undefined") {
    ledState.state = state;
    if (!state) {
      ledState.brightness = 0; // Reset brightness if LED is turned off
    }
    console.log(`LED State updated to: ${state ? "ON" : "OFF"}`);
  }

  // Update brightness if LED is on
  if (typeof brightness !== "undefined" && ledState.state) {
    ledState.brightness = brightness;
    console.log(`LED Brightness updated to: ${brightness}`);
  }

  res.json({
    message: "LED state updated",
    ledState,
  });
});

// Endpoint to update hardware status (heartbeat mechanism)
app.post("/hardware", (req, res) => {
  const { heartbeat } = req.body;

  if (heartbeat) {
    hardwareStatus.online = true;
    hardwareStatus.lastPing = Date.now();
    console.log("Heartbeat received. Hardware is online.");
    return res.json({
      message: "Heartbeat acknowledged",
      status: hardwareStatus,
    });
  }

  res.status(400).json({ message: "Invalid request. Heartbeat missing." });
});

// Endpoint to fetch hardware status
app.get("/hardware", (req, res) => {
  const response = {
    online: hardwareStatus.online,
    lastPing: hardwareStatus.lastPing,
  };

  res.json(response);
  console.log("Hardware status fetched:", response);
});

// Periodically check if the hardware is still online
setInterval(() => {
  const now = Date.now();
  const timeout = 3000; // 3 seconds timeout for "offline" status
  if (hardwareStatus.lastPing && now - hardwareStatus.lastPing > timeout) {
    hardwareStatus.online = false;
    console.log("Hardware status updated to offline.");
  }
}, 3000); // Set the interval to 3 seconds


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
