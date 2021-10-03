const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userDataModel = new Schema(
  {
    phoneNumber:{ type: String, required: true},
    travel:[
          {
            name:{ type: String, required: true },
            email: { type: String, required: true},
            startingAdd:{ type: String, required: true},
            endingAdd:{type: String, required: true},
            startlat:{type: String, required: true},
            startlong:{type: String, required: true},
            endlat:{type: String, required: true},
            endlot:{type: String, required: true},
            _id:{type:String, required: true},
            orderId:{type:String, required: true},
            distance:{type:String, required: true},
            advance:{type:String, required: true},
            billAmount:{type:String, required: true}
          }
    ]
}, 
{ timestamps: true }
)

module.exports = mongoose.model("UserData", userDataModel);