const mongoose = require("mongoose");

const policySchema = mongoose.schema(
  {
    policyType: { 
      type: String, 
      required: true, 
      enum: ['MG', 'MB'], 
      default: 'MG'
    },
  
    certificateNumber: { type: String, required: false },
    certificateIssueDate: { type: String, required: false },
    customerName: { type: String, required: false },
    address: { type: String, required: false },
    contactNumber: { type: String, required: false },
    customerGstNumber: { type: String, required: false },
    vehicle: { type: String, required: false },
    vehicleManufacturer: { type: String, required: false },
    vehicleModel: { type: String, required: false },
    vehicleIdNumber: { type: String, required: false },
    fuelType: { type: String, required: false },
    vehicleFirstRegDate: { type: String, required: false },
    vehiclePurchaseDate: { type: String, required: false },
    vehicleRegNumber: { type: String, required: false },
    exshowroomPrice: { type: String, required: false },
    odometerReading: { type: String, required: false },
    coolingOffPeriod: { type: String, required: false },
    extWarrantyStartDate: { type: String, required: false },
    extWarrantyEndDate: { type: String, required: false },
    product: { type: String, required: false },
    productPrice: { type: String, required: false },
    cgst: { type: String, required: false },
    sgst: { type: String, required: false },
    igst: { type: String, required: false },
    totalPrice: { type: String, required: false },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    isDisabled: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

const Policy = mongoose.model("Policy", policySchema);
module.exports = Policy;
