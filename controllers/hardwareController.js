let hardwareStatus = { online: false, lastPing: null, lastSeen: null };

const getIndiaTime = () => {
  const now = new Date();
  const indiaTimeZone = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const indiaDate = new Date(indiaTimeZone);
  return indiaDate.toLocaleString("en-US", { hour12: false });
};

exports.updateHardwareStatus = (req, res) => {
  try {
    const { heartbeat } = req.body;
    if (!heartbeat) {
      return res.status(400).json({ message: "Invalid request. Heartbeat missing." });
    }
    hardwareStatus.online = true;
    hardwareStatus.lastPing = Date.now();
    hardwareStatus.lastSeen = getIndiaTime();
    res.json({ message: "Heartbeat acknowledged", status: hardwareStatus });
  } catch (error) {
    console.error("Error updating hardware status:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.getHardwareStatus = (req, res) => {
  try {
    const response = {
      online: hardwareStatus.online,
      lastPing: hardwareStatus.lastPing ? new Date(hardwareStatus.lastPing).toLocaleString() : null,
      lastSeen: hardwareStatus.lastSeen || "Not available",
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching hardware status:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

setInterval(() => {
  try {
    const now = Date.now();
    const timeout = 10000;
    if (hardwareStatus.lastPing && now - hardwareStatus.lastPing > timeout) {
      if (hardwareStatus.online) hardwareStatus.lastSeen = getIndiaTime();
      hardwareStatus.online = false;
    }
  } catch (error) {
    console.error("Error in hardware status check:", error);
  }
}, 5000);
