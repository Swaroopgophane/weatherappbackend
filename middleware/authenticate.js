const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

const authenticate = async (req,res,next) =>{

    try{

    // const token = req.cookies.rwtoken;
    const token = localStorage.getItem('MYRWTOKEN');
    const verifyToken = jwt.verify(token,process.env.SECRET_KEY);

    const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token});

    if(!rootUser){throw new Error("User not found")}

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();

    }catch(err){
        console.log(err);
        res.status(401).send("Unauthorized:No token provided");
    }
    
}

module.exports = authenticate;