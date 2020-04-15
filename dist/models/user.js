"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { compare, hash } = require('bcrypt');
const { message } = require('../config/errors');
const { isPasswordValid, isMobileNumberValid } = require('../interface/validators');
const { Invite } = require('../models/invite');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 36
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 36
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(message.invalidEmail);
            }
        }
    },
    mobileNumber: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (!isMobileNumberValid(value)) {
                throw new Error(message.invalidMobileNumber);
            }
        }
    },
    countryCode: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!isPasswordValid(value)) {
                throw new Error(message.invalidPassword);
            }
        }
    },
    group: {
        type: String,
        required: true,
        Default: 'user'
    }
}, {
    timestamps: true
});
userSchema.statics.isEmailAvailable = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield exports.User.findOne({
        email
    });
    if (user) {
        return false;
    }
    const invite = yield Invite.findOne({
        email
    });
    if (!user && !invite) {
        return true;
    }
    return false;
});
exports.User = mongoose.model('User', userSchema);
