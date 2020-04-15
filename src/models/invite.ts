const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {compare, hash} = require('bcrypt');
const {message} = require('../config/errors');
const {isEmailValid, isPasswordValid, isMobileNumberValid} = require('../interface/validators');

const inviteSchema = new mongoose.Schema({
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
            if(!isEmailValid(value)){
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
    token : {
        type : String,
        required : true
    },
    tokenExpiry : {
        type : Number,
        required : true
    }
}, {
    timestamps : true
});

inviteSchema.statics.findInviteByToken = async (token: string) => {
    const invite = await Invite.findOne({
        token
    });

    return invite;
}

inviteSchema.pre('remove', async function(this: any, next: any){
    const invite = this;
    await Invite.findOneAndDelete({
        token : invite.token 
    });
    next();
})

export const Invite = mongoose.model('Invite', inviteSchema);


