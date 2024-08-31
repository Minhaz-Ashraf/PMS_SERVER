const { signinController, getUsersData, getUserById, deleteAgent} = require("../controllers/UserController");
const { authCheck } = require("../middleware/Auth");

module.exports = (app)=>{
    app.post("/api/v1/auth", signinController);
    app.delete("/api/v1/deleteAgent/:userId", deleteAgent)
    app.get("/api/v1/getUserData", authCheck, getUsersData)
    app.get("/api/v1/getUserDataById/:userId", getUserById)
}