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
const { verify } = require('jsonwebtoken');
const user_1 = require("../models/user");
const errors_1 = require("../config/errors");
exports.auth = (group) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = verify(token, process.env.SECRET_KEY);
            if (group === 'admin') {
                if (decoded.group !== 'admin') {
                    throw new Error();
                }
            }
            const user = yield user_1.User.findOne({ _id: decoded._id });
            if (!user) {
                throw new Error();
            }
            req.userId = user._id;
            next();
        }
        catch (e) {
            res.status(401).send({
                error: errors_1.error.Unauthorized,
                message: errors_1.message.Unauthorized
            });
        }
    });
};
