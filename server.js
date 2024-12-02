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
  lastSeen: null, // To store the last seen time when going offline
};

// Helper function to get the current time in IST format
function getIndiaTime() {
  const now = new Date();
  const indiaTimeZone = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const indiaDate = new Date(indiaTimeZone);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
  };

  return indiaDate.toLocaleString("en-US", options);
}

// Endpoint to get the LED state
app.get("/led", (req, res) => {
  try {
    if (!ledState.state) {
      ledState.brightness = 0; // Ensure brightness is 0 if the LED is off
    }

    res.json(ledState);
    console.log(
      `LED state fetched: State - ${ledState.state}, Brightness - ${ledState.brightness}`
    );
  } catch (error) {
    console.error("Error fetching LED state:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Endpoint to update the LED state (ON/OFF and brightness)
app.post("/led", (req, res) => {
  try {
    const { state, brightness } = req.body;

    // Validate input data
    if (typeof state !== "boolean" || (brightness && typeof brightness !== "number")) {
      return res.status(400).json({ message: "Invalid input data." });
    }

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
  } catch (error) {
    console.error("Error updating LED state:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Endpoint to update hardware status (heartbeat mechanism)
app.post("/hardware", (req, res) => {
  try {
    const { heartbeat } = req.body;

    if (!heartbeat) {
      return res.status(400).json({ message: "Invalid request. Heartbeat missing." });
    }

    hardwareStatus.online = true;
    hardwareStatus.lastPing = new Date(); // Update the last ping time only
    console.log("Heartbeat received. Hardware is online.");

    res.json({
      message: "Heartbeat acknowledged",
      status: hardwareStatus,
    });
  } catch (error) {
    console.error("Error updating hardware status:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Endpoint to fetch hardware status
app.get("/hardware", (req, res) => {
  try {
    const response = {
      online: hardwareStatus.online,
      lastPing: hardwareStatus.lastPing ? hardwareStatus.lastPing.toLocaleString() : null,
      lastSeen: hardwareStatus.lastSeen || "Not available", // Display the last seen time in IST
    };

    res.json(response);
    console.log("Hardware status fetched:", response);
  } catch (error) {
    console.error("Error fetching hardware status:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Periodically check if the hardware is still online
setInterval(() => {
  try {
    const now = Date.now();
    const timeout = 10000; // 10 seconds timeout for "offline" status
    if (hardwareStatus.lastPing && now - hardwareStatus.lastPing > timeout) {
      if (hardwareStatus.online) {
        hardwareStatus.online = false;
        hardwareStatus.lastSeen = getIndiaTime(); // Record last seen time only when going offline
        console.log("Hardware status updated to offline. Last seen recorded.");
      }
    }
  } catch (error) {
    console.error("Error in hardware status check:", error);
  }
}, 5000); // Set the interval to 5 seconds

// General error handling middleware (for unhandled routes)
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found." });
});

// Global error handler (catch unhandled errors)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
