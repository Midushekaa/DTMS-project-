const User = require("../../models/User");
const UserDependence = require("../../models/UserDependence");
const UserDisease = require("../../models/UserDisease");
const UserDisability = require("../../models/UserDisability");
const UserWorkHistory = require("../../models/UserWorkHistory");
const UserPettion = require("../../models/UserPettion");
const UserMedicalCondition = require("../../models/UserMedicalCondition");
const Workplace = require("../../models/Workplace");
const TransferApplication = require("../../models/TransferApplication");
const { calculateWorkplaceDistance } = require("./calculateWorkplaceDistance");
const { generateScore } = require("./scoreCalculator"); // adjust the path based on location

exports.transferProcess = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const transferApplication = await TransferApplication.findOne({ userId });
    if (!transferApplication) {
      return res.status(404).json({
        success: false,
        error: "Transfer application not found",
      });
    }

    const dependence = await UserDependence.findOne({ userId });
    const disease = await UserDisease.findOne({ userId });
    const disability = await UserDisability.findOne({ userId });
    const medicalCondition = await UserMedicalCondition.findOne({ userId });
    const workhistory = await UserWorkHistory.findOne({ userId });
    const pettision = await UserPettion.findOne({ userId });

    const workplaces = await Promise.all([
      Workplace.findById(transferApplication.preferWorkplace_1),
      Workplace.findById(transferApplication.preferWorkplace_2),
      Workplace.findById(transferApplication.preferWorkplace_3),
    ]);

    if (workplaces.some((wp) => !wp)) {
      return res.status(404).json({
        success: false,
        error: "Preferred workplaces not found",
      });
    }

    const score = generateScore(
      user,
      dependence,
      disease,
      disability,
      medicalCondition,
      workhistory,
      pettision
    );

    const categorizedWorkplaces = await calculateWorkplaceDistance(
      user,
      workplaces
    );

    let transferWorkplaceId = null;
    let workplaceCategory = "";

    if (score < 100) {
      const difficult = categorizedWorkplaces.find(
        (wp) => wp.category === "Difficult"
      );
      transferWorkplaceId = difficult?.workplace_id;
      workplaceCategory = "Difficult";
    } else if (score >= 100 && score <= 160) {
      const moderate = categorizedWorkplaces.find(
        (wp) => wp.category === "Moderate"
      );
      transferWorkplaceId = moderate?.workplace_id;
      workplaceCategory = "Moderate";
    } else {
      const prefered = categorizedWorkplaces.find(
        (wp) => wp.category === "Prefered"
      );
      transferWorkplaceId = prefered?.workplace_id;
      workplaceCategory = "Prefered";
    }

    const transferDesision = "Processed";
    const isProcessed = true;

    transferApplication.score = score;
    transferApplication.isProcessed = isProcessed;
    transferApplication.transferDesision = transferDesision;
    transferApplication.transferDesisionType = workplaceCategory;
    transferApplication.transfered_workplace_id = transferWorkplaceId;

    await transferApplication.save();

    return res.status(200).json({
      success: true,
      data: {
        userId,
        isProcessed,
        transferDesision,
        score,
        transfered_workplace_id: transferWorkplaceId,
        transferDesisionType: workplaceCategory,
        categorizedWorkplaces,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.publishApplication = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const transferApplication = await TransferApplication.findOne({ userId });
    if (!transferApplication) {
      return res.status(404).json({
        success: false,
        error: "Transfer application not found",
      });
    }

    transferApplication.isPublished = true;
    await transferApplication.save();

    return res.status(200).json({
      success: true,
      message: "Transfer applicaiton published successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
