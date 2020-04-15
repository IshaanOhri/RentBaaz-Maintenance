"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {mongoose} from 'mongoose';
const mongoose = require('mongoose');
const loginSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    tokenExpiry: {
        type: Number,
        required: true
    }
});
exports.Login = mongoose.model('Login', loginSchema);
