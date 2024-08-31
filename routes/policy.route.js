const { updatePolicyStatus, policyFormData } = require("../controllers/PoliciesController");

module.exports = (app) => {
  app.post("/api/v1/add-policies", policyFormData);
  app.post("/api/v1/approval", updatePolicyStatus);
};
