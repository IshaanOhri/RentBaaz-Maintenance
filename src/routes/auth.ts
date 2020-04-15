import {Router} from 'express';
import {error, message} from '../config/errors';
import {User} from '../models/user';
import {Login} from '../models/login';
import {auth} from '../middleware/auth';
import {Invite} from '../models/invite';

const {isEmailValid, isPasswordValid, isMobileNumberValid} = require('../interface/validators');
const {compare, hash} = require('bcrypt');
const {v4} = require('uuid');
const {sign} = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const router = Router();

let transport = nodemailer.createTransport({
    service : process.env.EMAIL_SERVICE,
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
});

router.post('/signUp', async (req,res) => {
    try{
        if(!req.body.firstName ||
            !req.body.lastName ||
            !req.body.email ||
            !req.body.mobileNumber ||
            !req.body.countryCode ||
            !req.body.password){
                res.status(400).send({
                    success : false,
                    error : error.invalidParameters,
                    message : message.invalidParameters
                })
                return;
            }
    
        if(!isEmailValid(req.body.email)){
            res.status(400).send({
                success : false,
                error : error.invalidEmail,
                message : message.invalidEmail
            });
            return;
        }
    
        const isEmailAvailable: boolean = await User.isEmailAvailable(req.body.email);
        if(!isEmailAvailable){
            res.status(400).send({
                success : false,
                error : error.emailTaken,
                message : message.emailTaken
            });
            return;
        }
    
        if(!isMobileNumberValid(req.body.mobileNumber)){
            res.status(400).send({
                success : false,
                error : error.invalidMobileNumber,
                message : message.invalidMobileNumber
            });
            return;
        }
    
        if(!isPasswordValid(req.body.password)){
            res.status(400).send({
                success : false,
                error : error.invalidPassword,
                message : message.invalidPassword
            });
            return;
        }
    
        const token: string  = v4();
        const tokenExpiry: Number = Date.now() + (4 * 60 * 60 * 1000);
        const passwordHashed: string = await hash(req.body.password, 8);
    
        const invite = new Invite({
            firstName : req.body.firstName, 
            lastName : req.body.lastName, 
            email : req.body.email, 
            mobileNumber : req.body.mobileNumber, 
            countryCode : req.body.countryCode, 
            password : passwordHashed, 
            token, 
            tokenExpiry});
    
        await invite.save();
    
        let mail = {
            from : `RentBaaz <${process.env.EMAIL_USER}>`,
            to : req.body.email,
            subject : 'Verify your account',
            text : `Click this link http://localhost:3000/verify/${token}. This link will expire in four hours.`
        };
    
        transport.sendMail(mail, function(error: any, data: any)  {
            if(error){
                console.log(error)
            }
        });
    
        res.send({
            success : true,
            message : 'Verification mail sent. Please check mail.'
        });
    }catch(error){
        res.status(500).send();
    }
})

router.get('/verify/:token', async (req,res) => {

    try{
        const invite = await Invite.findInviteByToken(req.params.token);

        if(!invite){
            res.status(400).send({
                success : false,
                error : error.invalidVerification,
                message : message.invalidVerification
            })
            return;
        }

        if(Date.now() > invite.tokenExpiry){
            res.status(400).send({
                success : false,
                error : error.verificationExpired,
                message : message.verificationExpired
            })
            return;
        }

        const user = User({
            firstName : invite.firstName,
            lastName : invite.lastName,
            email : invite.email,
            mobileNumber : invite.mobileNumber,
            countryCode : invite.countryCode,
            password : invite.password
        });
        await user.save();

        await invite.remove();

        res.send({
            success : true
        });
    }catch(error){
        res.status(500).send();
    }
    
})

router.post('/emailAvailable', async (req,res) => {
    try{
        if(!req.body.email){
            res.status(400).send({
                success : false,
                error : error.invalidParameters,
                message : message.invalidParameters
            })
            return;
        }
    
        if(!isEmailValid(req.body.email)){
            res.status(400).send({
                success : false,
                error : error.invalidEmail,
                message : message.invalidEmail
            });
            return;
        }
    
        const isEmailAvailable: boolean = await User.isEmailAvailable(req.body.email);
        if(!isEmailAvailable){
            res.status(400).send({
                success : false,
                error : error.emailTaken,
                message : message.emailTaken
            });
            return;
        }
    
        res.send({
            success : true
        });
    }catch(error){
        res.status(500).send();
    }
})

router.post('/login', async(req , res)=>{
    try{
        //check both params present
        if(!req.body.email || !req.body.password){
            return res.status(400).send({
                success : false,
                error : error.invalidParameters,
                message : error.invalidParameters
            });
        }
        //fetch user from db
        const user = await User.findOne({email : req.body.email});
        //if user not found
        if(!user){
            return res.send({
                success : false,
                error : error.userNotFound,
                message : message.userNotFound
            });
        }
        //compare password
        const success = await compare(req.body.password, user.password);
        if(!success){
            return res.send({
                success: false,
                error: error.invalidPassword,
                message: message.invalidPassword
            });
        }
        //generate refresh token
        const refreshToken = v4();
        const timestamp = Date.now();
        const tokenExpiry = timestamp + (3 * 24 * 60 * 60 * 100);       //expires in 3 days

        //generate access token
        const accessToken = sign({
            _id : user._id.toString(),
            group : user.group
        }, process.env.SECRET_KEY, {     // expires in 3 hours
            expiresIn : '3h'
        });
        //send response
        res.send({
            success : true,
            accessToken : accessToken,
            refreshToken : refreshToken
        })
        //saving to db
        await new Login({
            userId : user._id.toString(),
            refreshToken : refreshToken,
            tokenExpiry : tokenExpiry
        }).save();
    }catch(e){
        res.status(500).send(e);
    }
})

router.get('/refresh',async(req, res)=>{
    try{
        //check if refresh token is present in auth header
        if(!req.headers.authorization){
            return res.status(400).send({
                success : false,
                error : error.wrongParameters,
                message : message.wrongParameters
            });
        }
        //fetching login details
        const login = await Login.findOne({refreshToken : req.headers.authorization})
        if(login == null) {
            return res.status(401).json({
                success: false,
                error: error.wrongParameters,
                message: message.wrongParameter
            });
        }
        if(login.tokenExpiry <= Date.now){
            return res.status(401).send({
                success: false,
                error: error.unauthorized,
                message: message.unauthorized
            });
        }
        //update time for refresh token
        const timestamp = Date.now();
        const tokenExpiry = timestamp + (3 * 24 * 60 * 60 * 100);       //expires in 3 days
        login.tokenExpiry = tokenExpiry;
        //generate access token
        const user = await User.findById(login.userId);
        const accessToken = sign({
            _id : login._id.toString(),
            group : user.group
        }, process.env.SECRET_KEY, {     // expires in 3 hours
            expiresIn : '3h'
        });
        //final resp
        res.send({
            success : true,
            accessToken : accessToken
        });
        //saving in db
        await login.save();
    }catch(e){
        res.status(500).send(e);
    }
})

router.get('/logout', async(req, res)=>{
    try{
        //check if refresh token is present in auth header
        if(!req.headers.authorization){
            return res.status(400).send({
                success : false,
                error : error.wrongParameters,
                message : message.wrongParameters
            });
        }
        //send response
        res.send({
            success : true
        });
        //removing the document from db
        await Login.findOneAndDelete({refreshToken : req.headers.authorization}, {useFindAndModify : true});
    }catch(e){
        res.status(500).send(e);
    }
})

router.get('/logoutAll',  async(req, res)=>{
    try{
        //check if refresh token is present in auth header
        if(!req.headers.authorization){
            return res.status(400).send({
                success : false,
                error : error.wrongParameters,
                message : message.wrongParameters
            });
        }
        //send response
        res.send({
            success : true
        });
        const login = await Login.findOne({refreshToken : req.headers.authorization});
        await Login.deleteMany({userId : login.userId});
    }catch(e){
        res.status(500).send(e);
    }
})

module.exports = router;