const express = require ('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const keys = require('../../../config/keys');
const passport = require ('passport');

//Load Input validation

const validateRegisterInput = require('../../../validation/register');
const validateLoginInput = require('../../../validation/login');

//Load User model
 const User= require('../models/User');

// @route Get api/posts/test
// @desc Test users route
// @access public

router.get('/test', (req,res)=> res.json({msg:"Users Works"}));


// @route Get api/posts/register
// @desc Register user
// @access public
router.post('/register',(req, res ) => {

    const {errors, isValid }= validateRegisterInput(req.body);
    
    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    User.findOne({email:req.body.email})
    .then(user => {
        errors.email ='Email already exists'
        if(user){
            return res.status(400).json(errors);
        }else {
            const avatar = gravatar.url(req.body.email,{
                s:'200',//Size
                r: 'pg',//Rating,
                d:'mm',//Default
            });
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                avatar,
                password:req.body.password
            });

            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password, salt,(err,hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                })
            })
            

        }
    })
})


// @route Get api/users/register
// @desc Login user/returning JWT Token
// @access public

router.post('/login',(req,res)=>{
    const {errors, isValid }= validateLoginInput(req.body);
    
    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }  
    const email = req.body.email;
    const password = req.body.password;
    
    
    //find user by email
    User.findOne({ email }).then(user => {
        
        //check for user
        if(!user){
            errors.email ='user not found';
            return res.status(404).json(errors);
        }

       
        //check Password
        bcrypt.compare(password, user.password).then(isMatch => {
        
            
            if(isMatch){
                //res.json({ msg:'Success'});
                //User matched
                const payload  = { id:user.id, name:user.name, avatar:user.avatar} //create jwt payload

                //signed token
                jwt.sign(payload,
                    keys.secretOrKey,
                    {expiresIn: 3600},
                    (err,token)=>{
                        res.json({
                            sucess:true,
                            token:'Bearer '+token
                        })

                });

            }else{
                errors.password ='password incorrect'
                return res.status(400).json(errors)
            }
        });

        

        
    });

});

// @route Get api/users/current
// @desc Return current user
// @access private 

router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email
       
        
    });
});
module.exports = router;