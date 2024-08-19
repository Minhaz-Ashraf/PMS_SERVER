const mongoose = require("mongoose");

const userSchema = mongoose.schema(
  {
    brandName: { type: String, required: false },
    agentId: { type: String, required: false },
    agentName: { type: String, required: false },
    email: { type: String, required: false },
    contact: { type: String, required: false },
    password: { type: String, required: false },
    confirmPassword: { type: String, required: false },
    roleType: {
      type: String,
      required: false,
      enum: ["admin", "MG", "MB"],
      default: "MG",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
