const mongoose = require('mongoose');

const mgDataSchema = mongoose.Schema({
    model:{type: String, required: true},
    entryAge:{type:String, required: true},
    fourthYear:{type:Number, required:true},
    prevPlusFifthYear:{type:Number, required:true},
    prevPlusSixthYear:{type:Number, required:true},

})


const mgData = mongoose.model("mgData", mgDataSchema);
module.exports = mgData