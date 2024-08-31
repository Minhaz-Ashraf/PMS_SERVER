const { getPendingPolicy, updatePolicyStatus } = require("../controllers/PoliciesController");
const { addAgent, getMBagent, getMGagent } = require("../controllers/UserController");

module.exports = (app)=>{
    app.post("/api/v1/add-new-agent", addAgent);
    app.put("/api/v1/policyStatus", updatePolicyStatus)
    app.get("/api/v1/mb-agents", getMBagent);
    app.get("/api/v1/mg-agents", getMGagent);
    app.get("/api/v1/pendingPolicy", getPendingPolicy)


    
}