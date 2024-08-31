const { mbData, mgData } = require("../model/masterData");

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
      return res.status(404).json({ message: "Policy not found" });
    }

    const creationDate = new Date(policy.createdAt);
    const currentDate = new Date();
    const diffInDays = Math.floor(
      (currentDate - creationDate) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays > 15) {
      return res
        .status(403)
        .json({
          message: "Policy cannot be disabled after 15 days of creation",
        });
    }

    policy.isDisabled = true;
    await policy.save();

    res
      .status(200)
      .json({ message: "Policy disabled successfully", data: policy });
  } catch (err) {
    console.error("Error disabling policy:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.getMbOptions = async (req, res) => {
  try {
    const mbOptions = await mbData.find({});
    res.status(200).json({ mbOptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
exports.getMgOptions = async (req, res) => {
  try {
    const mgOptions = await mgData.find();
    res.status(200).json({ mgOptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updatePolicyStatus = async (req, res) => {
  try {
    const { id, type, ...policyData } = req.body;
    const validTypes = ["yetToApproved", "approved", "rejected"];
    console.log(type);
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid policy type." });
    }

    const policy = await Policy.findById(id);
    if (!policy) {
      return res.status(404).json({ message: "Policy not found." });
    }

    const requiredFields = [
      // "policyType",
      "userId",
      "customerName",
      "address",
      "contactNumber",
      "vehicleManufacturer",
      "vehicleModel",
      "vehicleIdNumber",
      "extWarrantyStartDate",
      "extWarrantyEndDate",
      "product",
      "productPrice",
      "totalPrice",
    ];

    for (let field of requiredFields) {
      if (!policyData[field] && !policy[field]) {
        return res
          .status(400)
          .json({ message: `The field ${field} is required.` });
      }
    }

    // Generating policyId
    if (!policy.policyId) {
      // Find all policies, sorted by creation date
      const allPolicies = await Policy.find().sort({ createdAt: 1 });
      // Find the index of the current policy
      const policyIndex = allPolicies.findIndex((p) => p._id.equals(id));

      if (policyIndex !== -1) {
        // Generate policyId using index (increment index by 1 to avoid 0 index)
        const currentYear = new Date().getFullYear();
        const policyId = `360-RG-${currentYear}-${(policyIndex + 1)
          .toString()
          .padStart(4, "0")}`;
        policy.policyId = policyId;
      }
    }

    // Update the policy status
    switch (type) {
      case "approved":
        policy.policyStatus = "approved";
        policy.approvedAt = new Date(); // Set the approval date
        break;
      case "rejected":
        policy.policyStatus = "rejected";
        break;
      default:
        policy.policyStatus = "yetToApproved"; // Default to yetToApproved
        break;
    }

    console.log("Updated policyStatus:", policy.policyStatus);
    // Updating chnged fields
    // Object.keys(policyData).forEach((key) => {
    //   policy[key] = policyData[key];
    // });

    await policy.save();

    return res
      .status(200)
      .json({ message: "Policy Status Changed Successfully.", policy });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getPendingPolicy = async (req, res) => {
  try {
    const { page = 1, limit = 10, manufacturer } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;

    const query = { policyStatus: "yetToApproved" };
    if (manufacturer) {
      query.vehicleManufacturer = manufacturer;
    }
    const totalPoliciesCount = await Policy.countDocuments(query);

    const policies = await Policy.find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(startIndex);

    const result = {
      data: policies,
      currentPage: pageNumber,
      hasLastPage: endIndex < totalPoliciesCount,
      hasPreviousPage: pageNumber > 1,
      nextPage: endIndex < totalPoliciesCount ? pageNumber + 1 : null,
      previousPage: pageNumber > 1 ? pageNumber - 1 : null,
      lastPage: Math.ceil(totalPoliciesCount / pageSize),
      totalPoliciesCount,
    };

    res.status(200).json(result);
  } catch (err) {
    console.error("Error while fetching policies:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};
