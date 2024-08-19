const Policy = require("../model/Policies");
const User = require("../model/User");
export const policyFormData = async (req, res) => {
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

export const editPolicy = async (req, res) => {
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

export const deletePolicy = async (req, res) => {
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

export const getAllPolicy = async (req, res) => {
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

export const getMgPolicies = async (req, res) => {
  try {
    const mgPolicies = await Policy.find({ policyType: "MG" });
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

export const getMbPolicies = async (req, res) => {
  try {
    const mbPolicies = await Policy.find({ policyType: "MB" });

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


export const disablePolicy = async (req, res) => {
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
