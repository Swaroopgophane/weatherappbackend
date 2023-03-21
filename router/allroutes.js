const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate');


require('../db/conn');
const User = require('../model/userSchema');



router.get('/',(req,res) =>{
    res.send("hello world from server");
});


// register route

router.post('/register', async (req,res) =>{

    const {name,email,phone,password,cpassword} = req.body;

    if(!name || !email || !phone || !password || !cpassword){
        return res.status(422).json({error:"Please filled the data"});
    }

    try{

        const userExist = await User.findOne({email:email});

        if(userExist){
            return res.status(422).json({error:"Email is already exist"});
        }else if(password != cpassword){
            return res.status(422).json({error:"Password not matching"});
        }else{

            const newUser = new User({name,email,phone,password,cpassword});

            // here we call the pre method to hash password

            const userCreated = await newUser.save();


            if(userCreated){
                return res.status(201).json({message:"User register successfully"});
            }

            
        }

    }catch(err){
        console.log(err);
    }

});


// login route

router.post('/signin', async (req,res) =>{

    try{

        const {email,password} = req.body;

        if(!email || !password){
            res.status(400).json({error:"Please filled the data"});
        }
    
        const userLogin = await User.findOne({email:email});
    
        if(userLogin){
    
            const isMatch = await bcrypt.compare(password, userLogin.password);
    
            if(!isMatch){
                res.status(400).json({error:"Invalid Details"});
            }else{
    
                const token = await userLogin.generateToken();
    
                res.cookie("rwtoken",token,{
                    httpOnly: true,
                    sameSite:'none',
                    secure:true,
                    expires:new Date(Date.now() + 2592000000)
    
                });
    
                res.json({message:"Login successfully"});
            }
    
        }else{
            res.status(400).json({error:"Invalid Details"});
        }

    }catch(err){
        console.log(err);
    }

   

});


// contact route

router.post('/contact', authenticate , async (req,res) =>{
    try{

        const {name,email,phone,message} = req.body;

        if(!name || !email || !phone || !message){
            return res.json({error:"Please fill the details"});
        }

        const userContact = await User.findOne({_id:req.userId});

        if(userContact){
            const userMessage = await userContact.addMessage(name,email,phone,message);

            await userContact.save();

            res.status(201).json({message:"Message send successfully"});
        }

        

    }catch(err){
        console.log(err);
    }
});


// weather route

router.get('/weather', authenticate ,(req,res) =>{
    console.log("Hello weather page");
    res.json({message:"Data fetched Successfully"});
});


// get user data for contact us and home page

router.get('/getuserInfo', authenticate, (req,res) =>{
    console.log("User Info");
    res.send(req.rootUser);
});


// Logout out route

router.get('/logout', (req,res) =>{
    console.log("Hello my logout");
    res.clearCookie('rwtoken',{ path:'/' });
    res.status(200).send("User logout");
});


module.exports = router;