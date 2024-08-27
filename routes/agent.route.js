const { signinController } = require("../controllers/UserController")
const { authCheck } = require("../middleware/Auth")

module.exports = (app)=>{
    app.post("/api/v1/auth", authCheck, signinController);
    
}