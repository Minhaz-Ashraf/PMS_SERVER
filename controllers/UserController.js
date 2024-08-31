const jwt = require("jsonwebtoken");
const userSchema = require("../model/User");
const dotenv = require("dotenv");
const fs = require("fs");
const json2csv = require("json2csv").parse;
dotenv.config();

exports.signinController = async (req, res) => {
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

exports.getUsersData = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { password, confirmPassword, ...userData } = user.toObject();

    res.status(200).json(userData);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching data for userId: ${userId}`);
  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, confirmPassword, ...userData } = user.toObject();
    res.status(200).json(userData);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  } 
};

exports.addAgent = async (req, res) => {
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
    console.log("Error saving agent data:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.editAgent = async (req, res) => {
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

exports.deleteAgent = async (req, res) => {
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

exports.getAllAgents = async (req, res) => {
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

exports.getMGagent = async (req, res) => {
  try {
    const mgAgents = await userSchema.find({ roleType: "1" });
    if (mgAgents.length === 0) {
      return res.status(404).json({ message: "No MG agents found" });
    }
    res.status(200).json({ message: "All MG Agents data", mgAgents });
  } catch (err) {
    console.error("Error while getting MG agents:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.getMBagent = async (req, res) => {
  try {
    const mbAgents = await userSchema.find({ roleType: "2" });
    if (mbAgents.length === 0) {
      return res.status(404).json({ message: "No MG agents found" });
    }
    res.status(200).json({ message: "All MB Agents data", mbAgents });
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
