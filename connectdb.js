const mongoose = require("mongoose");

async function connectDb() {
  try {
    // await mongoose.connect(process.env.MONGO_URI, { //for mongo atlas 
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false
    // });
    mongoose.connect('mongodb://localhost:27017/taxiapp', { useNewUrlParser: true,useUnifiedTopology: true, });
    console.log("Mongodb connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = connectDb;