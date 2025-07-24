const mongoose = require("mongoose");

const UserDependenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    dependentName: {
      type: String,
      required: [true, "Dependent name is required"],
    },
    dependentRelationship: {
      type: String,
      required: [true, "Dependent relationship is required"], 
    },
    dependentNIC: {
      type: String,
      unique: true,
      sparse: true,
    },
    workplace: {
      type: String,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"], 
    },
    categoryOfDependency: {
      type: String,
      required: [true, "Category of dependency is required"],
    },

    dependent_DOB: {
      type: Date,
      required: [true, "Dependent Date of Birth is required"], 
    },
    school: {
      type: String,
    },
    city: {
      type: String,
    },
    postalcode: {
      type: String,
    },
    grade: {
      type: String,
    },
    disability_type: {
      type: String,
    },
    disease_type: {
      type: String,
    },
    nature_of_dependent: {
      type: String,
    },
    Does_this_dependent_currently_undergo_any_treatment: {
      type: Boolean,
    },
    breastfeeding_required: {
      type: Boolean,
    },
    special_need_desc: {
      type: String,
    },
    live_with_dependant: {
      type: Boolean,
      required: [true, "Live with dependant is required"], 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDependence", UserDependenceSchema);
