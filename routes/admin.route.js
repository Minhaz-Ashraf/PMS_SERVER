const { addAgent, getMBagent, getMGagent } = require("../controllers/UserController");

module.exports = (app)=>{
    app.post("/api/v1/add-new-agent", addAgent);
    app.get("/api/v1/mb-agents", getMBagent);
    app.get("/api/v1/mg-agents", getMGagent);


    
}