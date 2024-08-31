const mongoose = require("mongoose");
const policySchema = mongoose.Schema(
  // {
  //   policyType: {
  //     type: String,
  //     required: true,
  //     enum: ["MG", "MB"],
  //     default: "MG",
  //   },
{
    customerName: { type: String, required: false },
    panNumber:{type: String, required: true},
    address: { type: String, required: false },
    contactNumber: { type: String, required: false },
    customerGstNumber: { type: String, required: false },
    vehicleManufacturer: { type: String, required: false },
    vehicleModel: { type: String, required: false },
    vehicleIdNumber: { type: String, required: false },
    vehicleRegNumber: { type: String, required: false },
    exshowroomPrice: { type: String, required: false },
    fuelType: { type: String, required: false },
    vehiclePurchaseDate: { type: String, required: false },
    vehicleRegNumber: { type: String, required: false },
    exshowroomPrice: { type: String, required: false },
    odometerReading: { type: String, required: false },
    coolingOffPeriod: { type: String, required: false },
    extWarrantyStartDate: { type: String, required: false },
    extWarrantyEndDate: { type: String, required: false },
    product: { type: String, required: false },
    productPrice: { type: Number, required: false },
    gst: { type: Number, required: false },
    totalPrice: { type: Number, required: false },
    price: { type: Number, required: false },
    variant: { type: String, required: false },


    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
      required: true,
    },
    policyId: { type: String, required: false },
    policyStatus: {
      type: String,
      enum: ["yetToApproved", "approved", "rejected"],
      default: "yetToApproved",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    approvedAt: {
      type: Date,
      default: new Date().toISOString(),
      required: false,
    },
  },
  { timestamps: true }
);

const Policy = mongoose.model("Policy", policySchema);
module.exports = Policy;
