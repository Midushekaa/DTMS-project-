const mongoose = require("mongoose");

const UserMedicalConditionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Foreign key reference
    type: { type: String, required: true },
    notes: { type: String, required: true },
    validation_period: { type: Number }, 

  },
  { timestamps: true }
);

module.exports = mongoose.model("UserMedicalCondition", UserMedicalConditionSchema);
