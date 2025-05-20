const express = require("express");

const router = express.Router();
const transferApplcaitions = require("../../controllers/admin/transferApplcaitionsController");

// Get Routes
router.get("/notApplied-users", transferApplcaitions.getNotAppliedUsers);
router.get("/total-applications", transferApplcaitions.getTotalSubmitedTransferApplications);
router.get("/pending-applications", transferApplcaitions.getPendingTransferApplications);
router.get("/rejected-applications", transferApplcaitions.getRejectedTransferApplications);
router.get("/checked-applications", transferApplcaitions.getCheckedTransferApplications);
router.get("/recommended-applications", transferApplcaitions.getRecommendedTransferApplications);
router.get("/approved-applications", transferApplcaitions.getApprovedTransferApplications);

// Update Routes
router.put("/check-application/:id", transferApplcaitions.checkTransferApplication);
router.put("/recommend-application/:id", transferApplcaitions.recommendTransferApplication);
router.put("/approve-application/:id", transferApplcaitions.approveTransferApplication);
router.put("/reject-application/:id", transferApplcaitions.rejectTransferApplication);
router.put("/remove-application/:id", transferApplcaitions.removeTransferApplication);

module.exports = router;
