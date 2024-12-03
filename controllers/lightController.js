let ledState = { state: false, brightness: 0 };

exports.getLedState = (req, res) => {
  try {
    if (!ledState.state) {
      ledState.brightness = 0;
    }
    res.json(ledState);
    console.log(`LED state fetched: State - ${ledState.state}, Brightness - ${ledState.brightness}`);
  } catch (error) {
    console.error("Error fetching LED state:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.updateLedState = (req, res) => {
  try {
    const { state, brightness } = req.body;
    if (typeof state !== "boolean" || (brightness && typeof brightness !== "number")) {
      return res.status(400).json({ message: "Invalid input data." });
    }
    if (typeof state !== "undefined") {
      ledState.state = state;
      if (!state) ledState.brightness = 0;
    }
    if (typeof brightness !== "undefined" && ledState.state) {
      ledState.brightness = brightness;
    }
    res.json({ message: "LED state updated", ledState });
  } catch (error) {
    console.error("Error updating LED state:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
