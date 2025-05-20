const express = require("express");

const router = express.Router();
const transferProcessController = require("../../controllers/transferProcess/transferProcessController");
const findReplacementController = require("../../controllers/transferProcess/findReplacementController");

// Transfer logic Routes
router.put("/transfer-application/process/:userId", transferProcessController.transferProcess);
router.put("/transfer-application/find/:userId", findReplacementController.findReplacement);
router.put("/transfer-application/publish/:userId", transferProcessController.publishApplication);

module.exports = router;
