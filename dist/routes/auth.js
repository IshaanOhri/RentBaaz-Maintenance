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
const express_1 = require("express");
const errors_1 = require("../config/errors");
const user_1 = require("../models/user");
const login_1 = require("../models/login");
const invite_1 = require("../models/invite");
const { isEmailValid, isPasswordValid, isMobileNumberValid } = require('../interface/validators');
const { compare, hash } = require('bcrypt');
const uniqid = require('crypto-random-string');
const { sign } = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const router = express_1.Router();
let transport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
router.post('/signUp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.firstName ||
            !req.body.lastName ||
            !req.body.email ||
            !req.body.mobileNumber ||
            !req.body.countryCode ||
            !req.body.password) {
            res.status(400).send({
                success: false,
                error: errors_1.error.invalidParameters,
                message: errors_1.message.invalidParameters
            });
            return;
        }
        if (!isEmailValid(req.body.email)) {
            res.status(400).send({
                success: false,
                error: errors_1.error.invalidEmail,
                message: errors_1.message.invalidEmail
            });
            return;
        }
        const isEmailAvailable = yield user_1.User.isEmailAvailable(req.body.email);
        if (!isEmailAvailable) {
            res.status(400).send({
                success: false,
                error: errors_1.error.emailTaken,
                message: errors_1.message.emailTaken
            });
            return;
        }
        if (!isMobileNumberValid(req.body.mobileNumber)) {
            res.status(400).send({
                success: false,
                error: errors_1.error.invalidMobileNumber,
                message: errors_1.message.invalidMobileNumber
            });
            return;
        }
        if (!isPasswordValid(req.body.password)) {
            res.status(400).send({
                success: false,
                error: errors_1.error.invalidPassword,
                message: errors_1.message.invalidPassword
            });
            return;
        }
        const token = uniqid({ length: 32, type: 'url-safe' });
        const tokenExpiry = Date.now() + (4 * 60 * 60 * 1000);
        const passwordHashed = yield hash(req.body.password, 8);
        const invite = new invite_1.Invite({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            countryCode: req.body.countryCode,
            password: passwordHashed,
            token,
            tokenExpiry
        });
        yield invite.save();
        let mail = {
            from: `RentBaaz <${process.env.EMAIL_USER}>`,
            to: req.body.email,
            subject: 'Verify your account',
            text: `Click this link http://localhost:3000/verify/${token}. This link will expire in four hours.`
        };
        transport.sendMail(mail, function (error, data) {
            if (error) {
                console.log(error);
            }
        });
        res.send({
            success: true,
            message: 'Verification mail sent. Please check mail.'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send();
    }
}));
router.get('/verify/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invite = yield invite_1.Invite.findInviteByToken(req.params.token);
        if (!invite) {
            res.status(400).send({
                success: false,
                error: errors_1.error.invalidVerification,
                message: errors_1.message.invalidVerification
            });
            return;
        }
        if (Date.now() > invite.tokenExpiry) {
            res.status(400).send({
                success: false,
                error: errors_1.error.verificationExpired,
                message: errors_1.message.verificationExpired
            });
            return;
        }
        const user = user_1.User({
            firstName: invite.firstName,
            lastName: invite.lastName,
            email: invite.email,
            mobileNumber: invite.mobileNumber,
            countryCode: invite.countryCode,
            password: invite.password
        });
        yield user.save();
        yield invite.remove();
        res.send({
            success: true
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send();
    }
}));
router.post('/emailAvailable', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email) {
            res.status(400).send({
                success: false,
                error: errors_1.error.invalidParameters,
                message: errors_1.message.invalidParameters
            });
            return;
        }
        if (!isEmailValid(req.body.email)) {
            res.status(400).send({
                success: false,
                error: errors_1.error.invalidEmail,
                message: errors_1.message.invalidEmail
            });
            return;
        }
        const isEmailAvailable = yield user_1.User.isEmailAvailable(req.body.email);
        if (!isEmailAvailable) {
            res.status(400).send({
                success: false,
                error: errors_1.error.emailTaken,
                message: errors_1.message.emailTaken
            });
            return;
        }
        res.send({
            success: true
        });
    }
    catch (error) {
        res.status(500).send();
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check both params present
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({
                success: false,
                error: errors_1.error.invalidParameters,
                message: errors_1.error.invalidParameters
            });
        }
        //fetch user from db
        const user = yield user_1.User.findOne({ email: req.body.email });
        //if user not found
        if (!user) {
            return res.send({
                success: false,
                error: errors_1.error.userNotFound,
                message: errors_1.message.userNotFound
            });
        }
        //compare password
        const success = yield compare(req.body.password, user.password);
        if (!success) {
            return res.send({
                success: false,
                error: errors_1.error.incorrectPassword,
                message: errors_1.message.incorrectPassword
            });
        }
        //generate refresh token
        const refreshToken = uniqid({ length: 32, type: 'url-safe' });
        const timestamp = Date.now();
        const tokenExpiry = timestamp + (3 * 24 * 60 * 60 * 100); //expires in 3 days
        //generate access token
        const accessToken = sign({
            _id: user._id.toString(),
            group: user.group
        }, process.env.SECRET_KEY, {
            expiresIn: '3h'
        });
        //send response
        res.send({
            success: true,
            accessToken: accessToken,
            refreshToken: refreshToken
        });
        //saving to db
        yield new login_1.Login({
            userId: user._id.toString(),
            refreshToken: refreshToken,
            tokenExpiry: tokenExpiry
        }).save();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get('/refresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check if refresh token is present in auth header
        if (!req.headers.authorization) {
            return res.status(400).send({
                success: false,
                error: errors_1.error.wrongParameters,
                message: errors_1.message.wrongParameters
            });
        }
        //fetching login details
        const login = yield login_1.Login.findOne({ refreshToken: req.headers.authorization });
        if (login == null) {
            return res.status(401).json({
                success: false,
                error: errors_1.error.wrongParameters,
                message: errors_1.message.wrongParameter
            });
        }
        if (login.tokenExpiry <= Date.now) {
            return res.status(401).send({
                success: false,
                error: errors_1.error.unauthorized,
                message: errors_1.message.unauthorized
            });
        }
        //update time for refresh token
        const timestamp = Date.now();
        const tokenExpiry = timestamp + (3 * 24 * 60 * 60 * 100); //expires in 3 days
        login.tokenExpiry = tokenExpiry;
        //generate access token
        const user = yield user_1.User.findById(login.userId);
        const accessToken = sign({
            _id: login._id.toString(),
            group: user.group
        }, process.env.SECRET_KEY, {
            expiresIn: '3h'
        });
        //final resp
        res.send({
            success: true,
            accessToken: accessToken
        });
        //saving in db
        yield login.save();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check if refresh token is present in auth header
        if (!req.headers.authorization) {
            return res.status(400).send({
                success: false,
                error: errors_1.error.wrongParameters,
                message: errors_1.message.wrongParameters
            });
        }
        //send response
        res.send({
            success: true
        });
        //removing the document from db
        yield login_1.Login.findOneAndDelete({ refreshToken: req.headers.authorization }, { useFindAndModify: true });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get('/logoutAll', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check if refresh token is present in auth header
        if (!req.headers.authorization) {
            return res.status(400).send({
                success: false,
                error: errors_1.error.wrongParameters,
                message: errors_1.message.wrongParameters
            });
        }
        //send response
        res.send({
            success: true
        });
        const login = yield login_1.Login.findOne({ refreshToken: req.headers.authorization });
        yield login_1.Login.deleteMany({ userId: login.userId });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
module.exports = router;
