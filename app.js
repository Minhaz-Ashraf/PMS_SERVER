const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require("helmet");
let router = express.Router();
const { initializeRoutes } = require('./routes/index');
http = require("http");


dotenv.config();
const app = express();
const port = process.env.PORT || 8800;


async function mongoDBConnection(){
    try{
     await mongoose.connect(process.env.MONGODB_URL);
     console.log('Connected to mongodb')
    }catch(error)
    {
console.error("Error in connecting mongodb", error)
    }
}


async function startServer() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet({ crossOriginResourcePolicy: false }));
    app.use(morgan("common"));
    app.use(cors());
    initializeRoutes(app);
    const server = http.createServer(app);
    app.use(router);
  
    app.use("/running-status", (req, res) => {
      res.status(200).send("API is connected");
    });
  
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
  
  mongoDBConnection().then(startServer);
