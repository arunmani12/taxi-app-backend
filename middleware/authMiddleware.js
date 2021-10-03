const jwt = require("jsonwebtoken");
const User = require('../models/user')



module.exports = async(req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send(`Unauthorized`);
    }

    const { userId } = jwt.verify(req.headers.authorization, process.env.jwtSecret);
    let user = await User.findById(userId)
    console.log(user)
    if(!user){
      return res.status(401).send('Unauthorized')
    }

    // req.userId = userId;

    // console.log(userId)
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send(`Unauthorized`);
  }
};
