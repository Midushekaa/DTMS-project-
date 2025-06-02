const mongoose = require("mongoose");

const CadreSchema = new mongoose.Schema(
  {
    designation: { type: String, required: true },
    workplace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workplace",
      required: true,
    },
    approvedCadre: { type: String, required: true },
    existingCadre: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cadre", CadreSchema);
