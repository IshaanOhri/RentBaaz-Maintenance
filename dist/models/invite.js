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
const jwt = require('jsonwebtoken');
const { compare, hash } = require('bcrypt');
const { message } = require('../config/errors');
const { isEmailValid, isPasswordValid, isMobileNumberValid } = require('../interface/validators');
const inviteSchema = new mongoose.Schema({
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
            if (!isEmailValid(value)) {
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
    token: {
        type: String,
        required: true
    },
    tokenExpiry: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});
inviteSchema.statics.findInviteByToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const invite = yield exports.Invite.findOne({
        token
    });
    return invite;
});
inviteSchema.pre('remove', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const invite = this;
        yield exports.Invite.findOneAndDelete({
            token: invite.token
        });
        next();
    });
});
exports.Invite = mongoose.model('Invite', inviteSchema);
