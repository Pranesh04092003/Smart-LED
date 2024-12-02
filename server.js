const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let ledState = {
  state: false, // LED state (false = OFF, true = ON)
  brightness: 0, // Default brightness (0-255)
};

// Endpoint to get the LED state
app.get("/led", (req, res) => {
  // If the LED is OFF, set the brightness to 0 before sending the response
  if (!ledState.state) {
    ledState.brightness = 0;
  }

  res.json(ledState);
  console.log(
    LED state fetched: State - ${ledState.state}, Brightness - ${ledState.brightness}
  );
});

// Endpoint to update the LED state (ON/OFF and brightness)
app.post("/led", (req, res) => {
  const { state, brightness } = req.body;

  // If the state is provided, update it
  if (typeof state !== "undefined") {
    ledState.state = state;
    console.log(LED State updated to: ${state ? "ON" : "OFF"});

    // If the LED is OFF, set brightness to 0
    if (!state) {
      ledState.brightness = 0;
    }
  }

  // If the brightness is provided and the LED is ON, update the brightness
  if (typeof brightness !== "undefined" && state) {
    ledState.brightness = brightness;
    console.log(LED Brightness updated to: ${brightness});
  }

  // Send the updated state and brightness back to the client
  res.json({
    message: "LED state updated",
    ledState,
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(Server is running on http://localhost:${PORT});
});
