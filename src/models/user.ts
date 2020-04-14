const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const {compare, hash} = require('bcrypt');
const {message} = require('../config/errors');
const {isPasswordValid, isMobileNumberValid} = require('../interface/validators');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
        maxlength : 36
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
        maxlength : 36
    },
    email : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        unique : true,
        validate(value: string): void {
            if(!validator.isEmail(value)){
                throw new Error(message.invalidEmail);
            }
        }
    },
    mobileNumber : {
        type : Number,
        required : true,
        trim : true,
        validate(value: string): void {
            if(!isMobileNumberValid(value)){
                throw new Error(message.invalidMobileNumber)
            }
        }
    },
    countryCode : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String, 
        required : true,
        trim : true,
        validate(value: string): void {
            if(!isPasswordValid(value)){
                throw new Error(message.invalidPassword);
            }
        }
    },
    refreshToken : {
        type : String,
        required : true
    },
    accessToken : [{
        token : {
            type : String,
            required : true
        }
    }]
}, {
    timestamps : true
})
