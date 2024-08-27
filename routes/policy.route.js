const { updatePolicyStatus } = require("../controllers/PoliciesController");

module.exports = (app)=>{
    app.post("/api/v1/approval", updatePolicyStatus);
    
}