const mongoose = require("mongoose");

const UserDiseaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 
    type: { type: String, required: true },
    are_you_taking_treatment: { type: Boolean, required: true },
    treatment_date: { type: Date },
    soft_work_recommendation: { type: Boolean, required: true },
    soft_work_period: { type: Number }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDisease", UserDiseaseSchema);
