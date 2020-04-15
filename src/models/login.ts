// import {mongoose} from 'mongoose';
const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    refreshToken : {
        type : String,
        required : true
    },
    tokenExpiry : {
        type : Number,
        required : true
    }
});

export const Login = mongoose.model('Login', loginSchema);