const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  adminRole: { type: String, required: true },
  workplace_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workplace",
    required: true,
  },
  password: { type: String, required: true },
  securePassword: { type: String, required: true },
});

module.exports = mongoose.model("Admin", AdminSchema);
