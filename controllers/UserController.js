const jwt = require("jsonwebtoken");
const userSchema = require("../model/User");
const dotenv = require("dotenv");
const fs = require("fs");
const json2csv = require("json2csv").parse;
dotenv.config();

export const signinController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid Field" });
  }

  try {
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (existingUser.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "48h" }
    );

    res.status(200).json({ token, user: existingUser });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const addAgent = async (req, res) => {
  try {
    const agentData = req.body;

    const { email } = agentData;

    const existingAgent = await userSchema.findOne({ email });
    if (existingAgent) {
      return res.status(409).json({ message: "Agent already exists" });
    }

    const newAgent = new userSchema(agentData);
    await newAgent.save();

    res
      .status(201)
      .json({ message: "Agent added successfully", data: newAgent });
  } catch (err) {
    console.error("Error saving agent data:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

export const editAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedAgent = await userSchema.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res
      .status(200)
      .json({ message: "Agent updated successfully", data: updatedAgent });
  } catch (err) {
    console.error("Error updating agent data:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAgent = await userSchema.findByIdAndDelete(id);

    if (!deletedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json({ message: "Agent deleted successfully" });
  } catch (err) {
    console.error("Error deleting agent:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

export const getAllAgents = async (req, res) => {
  try {
    const agents = await userSchema.find();

    if (agents.length === 0) {
      return res.status(404).json({ message: "No agents found" });
    }
    res
      .status(200)
      .json({ message: "Agents retrieved successfully", data: agents });
  } catch (err) {
    console.error("Error retrieving agents:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

export const getMGagent = async (req, res) => {
  try {
    const mgAgents = await userSchema.findAll({ roleType: "MB" });
    if (mgAgents.length === 0) {
      return res.status(404).json({ message: "No MG agents found" });
    }
    res.status(200).json({ message: "All MG Agents data", mgAgents });
  } catch (err) {
    console.error("Error while getting MG agents:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

export const getMBagent = async (req, res) => {
  try {
    const mgAgents = await userSchema.findAll({ roleType: "MG" });
    if (mgAgents.length === 0) {
      return res.status(404).json({ message: "No MG agents found" });
    }
    res.status(200).json({ message: "All MG Agents data", mgAgents });
  } catch (err) {
    console.error("Error while getting MG agents:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.downloadCsv = async (req, res) => {
  try {
    const data = await User.find({});

    const csvData = json2csv(data, {
      fields: [
        "brandName",
        "agentId",
        "agentName",
        "email",
        "contact",
        "roleType",
      ],
    });

    const filePath = "exportedData.csv";
    fs.writeFileSync(filePath, csvData);

    res.download(filePath, "exportedData.csv", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting file:", unlinkErr);
          }
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
