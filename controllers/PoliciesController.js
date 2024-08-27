const mgData = require("../model/data");
const Policy = require("../model/Policies");
const User = require("../model/User");



exports.policyFormData = async (req, res) => {
  try {
    const { userId, ...policyData } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const newPolicy = new Policy({ ...policyData, userId });
    await newPolicy.save();

    res
      .status(201)
      .json({ message: "Policy data saved successfully", data: newPolicy });
  } catch (error) {
    console.error("Error saving policy data:", error);
    res.status(500).json({ message: "Failed to save policy data", error });
  }
};

exports.editPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedPolicy = await Policy.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedPolicy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.status(200).json({ message: "Policy update successfully" });
  } catch (err) {
    console.error("Error updating agent data:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteData = await Policy.findByIdAndDelete(id);
    if (!deleteData) {
      return res.status(404).json({ message: "Policy not found" });
    }
    res.status(200).json({ message: "Policy deleted successfully" });
  } catch (err) {
    console.error("Error updating agent data:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.getAllPolicy = async (req, res) => {
  try {
    const policies = await Policy.find();
    if (policies.length === 0) {
      return res.status(404).json({ message: "No agents found" });
    }
    res.status(200).json({ message: "Policy data", data: policies });
  } catch (err) {
    console.error("Error while fetching policies:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.getMgPolicies = async (req, res) => {
  try {
    const mgPolicies = await Policy.find({ policyType: "1" });
    if (mgPolicies.length === 0) {
      return res.status(404).json({ message: "No MG policies found" });
    }
    res
      .status(200)
      .json({ message: "MG policies fetched successfully", data: mgPolicies });
  } catch (err) {
    console.error("Error while getting MG policies:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.getMbPolicies = async (req, res) => {
  try {
    const mbPolicies = await Policy.find({ policyType: "2" });

    if (mbPolicies.length === 0) {
      return res.status(404).json({ message: "No MB policies found" });
    }

    res
      .status(200)
      .json({ message: "MB policies fetched successfully", data: mbPolicies });
  } catch (err) {
    console.error("Error while getting MB policies:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};


exports.disablePolicy = async (req, res) => {
  try {
    const { policyId } = req.params;

    const policy = await Policy.findById(policyId);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    const creationDate = new Date(policy.createdAt);
    const currentDate = new Date();
    const diffInDays = Math.floor((currentDate - creationDate) / (1000 * 60 * 60 * 24));

    if (diffInDays > 15) {
      return res.status(403).json({ message: 'Policy cannot be disabled after 15 days of creation' });
    }

    policy.isDisabled = true;
    await policy.save();

    res.status(200).json({ message: 'Policy disabled successfully', data: policy });
  } catch (err) {
    console.error('Error disabling policy:', err);
    res.status(500).json({ message: 'Something went wrong', error: err });
  }
};



exports.getMgOptions = async(req, res) =>{
  try{
   const mgOptions = await mgData.find();
   res.status(200).json({mgOptions})
  }catch(err){
    console.error(err);
    res.status(500).json({message: "Something went wrong"});
  }
}



exports.updatePolicyStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { type, ...policyData } = req.body; 
    const validTypes = ["yetToApproved", "approved", "rejected"];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid policy type." });
    }

    const policy = await Policy.findById(id);
    if (!policy) {
      return res.status(404).json({ message: "Policy not found." });
    }

    const requiredFields = [
      "policyType",
      "userId",
      "customerName",
      "address",
      "contactNumber",
      "vehicle",
      "vehicleManufacturer",
      "vehicleModel",
      "vehicleIdNumber",
      "vehicleFirstRegDate",
      "extWarrantyStartDate",
      "extWarrantyEndDate",
      "product",
      "productPrice",
      "totalPrice",
    ];

    for (let field of requiredFields) {
      if (!policyData[field] && !policy[field]) {
        return res.status(400).json({ message: `The field ${field} is required.` });
      }
    }

    // Generating policyId 
    if (!policy.policyId) {
      const currentYear = new Date().getFullYear();
      const policyCount = await Policy.countDocuments();
      const policyId = `360-RG-${currentYear}-${(policyCount + 1).toString().padStart(4, "0")}`;
      policy.policyId = policyId;
    }

    // Update the policy status
    policy.policyStatus = type;
    policy.approvedAt = type === "approved" ? new Date() : policy.approvedAt;

    // Updating chnged fields 
    Object.keys(policyData).forEach((key) => {
      policy[key] = policyData[key];
    });

    await policy.save();

    return res.status(200).json({ message: "Policy Status Changed Successfully.", policy });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



