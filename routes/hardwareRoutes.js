const express = require("express");
const { getHardwareStatus, updateHardwareStatus } = require("../controllers/hardwareController");

const router = express.Router();

router.get("/", getHardwareStatus);
router.post("/", updateHardwareStatus);

module.exports = router;
