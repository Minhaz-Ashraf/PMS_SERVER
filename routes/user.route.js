const { signinController, getUsersData, getUserById} = require("../controllers/UserController");
const { authCheck } = require("../middleware/Auth");

module.exports = (app)=>{
    app.post("/api/v1/auth", signinController);
    app.get("/api/v1/getUserData", authCheck, getUsersData)
    app.get("/api/v1/getUserDataById/:userId", getUserById)
}