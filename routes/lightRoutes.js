const express = require("express");
const { getLedState, updateLedState } = require("../controllers/lightController");

const router = express.Router();

router.get("/", getLedState);
router.post("/", updateLedState);

module.exports = router;
