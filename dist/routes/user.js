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
const auth_1 = require("../middleware/auth");
const { compare, hash } = require('bcrypt');
const { v4 } = require('uuid');
const { sign } = require('jsonwebtoken');
const router = express_1.Router();
router.patch('/update', auth_1.auth('*'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const validUpdates = ['firstName', 'lastName', 'mobileNumber'];
    const isValidUpdate = updates.every((update) => {
        return validUpdates.includes(update);
    });
    if (!isValidUpdate) {
        return res.status(400).send({
            success: false,
            error: errors_1.error.wrongParameters,
            message: errors_1.message.wrongParameters
        });
    }
    try {
        const user = yield user_1.User.findById(req.userId);
        updates.forEach((update) => {
            user[update] = req.body[update];
        });
        yield user.save();
        res.send({
            success: true
        });
    }
    catch (e) {
        res.send(500).send();
    }
}));
router.patch('/resetPassword', auth_1.auth('*'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.passwordOld || !req.body.passwordNew) {
            res.status(400).send({
                success: false,
                error: errors_1.error.invalidParameters,
                message: errors_1.message.invalidParameters
            });
        }
        const user = yield user_1.User.findById(req.userId);
        const check = yield compare(req.body.passwordOld, user.password);
        if (!check) {
            res.send({
                success: false,
                error: errors_1.error.wrongPswd,
                message: errors_1.message.wrongPswd
            });
        }
        user.password = yield hash(req.body.passwordNew, 8);
        res.send({
            success: true,
        });
        yield user.save();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
module.exports = router;
