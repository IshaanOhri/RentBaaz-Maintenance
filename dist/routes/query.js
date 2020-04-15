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
const query_1 = require("../models/query");
const router = express_1.Router();
router.post('/addQuery', auth_1.auth('*'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.productName || !req.body.description) {
        return res.send({
            success: false,
            error: errors_1.error.invalidParameters,
            message: errors_1.message.invalidParameters
        });
    }
    try {
        const query = new query_1.Query(Object.assign(Object.assign({}, req.body), { owner: req.userId }));
        yield query.save();
        res.send({
            success: true,
        });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete('/deleteQuery/:id', auth_1.auth('*'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = yield query_1.Query.findOneAndDelete({ _id: req.params.id, owner: req.userId });
        if (!query) {
            return res.status(400).send({
                success: false,
                error: errors_1.error.notFound,
                message: errors_1.message.notFound
            });
        }
        res.send({
            success: true
        });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch('/updateQuery/:id', auth_1.auth('*'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const validUpdates = ['productName', 'description'];
    const isValid = updates.every((update) => {
        return validUpdates.includes(update);
    });
    if (!isValid) {
        return res.status(400).send({
            success: false,
            error: errors_1.error.wrongParameters,
            message: errors_1.message.wrongParameters
        });
    }
    try {
        const query = yield query_1.Query.findOne({ _id: req.params.id, owner: req.userId });
        if (!query) {
            return res.status(400).send({
                success: false,
                error: errors_1.error.notFound,
                message: errors_1.message.notFound
            });
        }
        updates.forEach((update) => {
            query[update] = req.body[update];
        });
        yield query.save();
        res.send({
            success: true
        });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post('/getQuery', auth_1.auth('*'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = yield query_1.Query.findOne({
            _id: req.body._id
        });
        if (!query) {
            res.status(400).send({
                success: false,
                error: errors_1.error.notFound,
                message: errors_1.message.notFound
            });
            return;
        }
        const sendQuery = query.toObject();
        yield delete sendQuery.owner;
        res.send(sendQuery);
    }
    catch (error) {
        console.log(error);
        res.status(500).send();
    }
}));
router.get('/getQuery', auth_1.auth('*'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findOne({
            _id: req.userId
        });
        yield user.populate('query').execPopulate();
        if (user.query.length === 0) {
            res.send({
                success: false,
                error: errors_1.error.notFound,
                message: errors_1.message.notFound
            });
            return;
        }
        res.send(user.query);
    }
    catch (error) {
        console.log(error);
        res.status(500).send();
    }
}));
router.get('/allQueries', auth_1.auth('admin'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = yield query_1.Query.find({});
        if (query.length === 0) {
            res.send({
                success: false,
                error: errors_1.error.notFound,
                message: errors_1.message.notFound
            });
            return;
        }
        res.send(query);
    }
    catch (error) {
        console.log(error);
        res.status(500).send();
    }
}));
module.exports = router;
