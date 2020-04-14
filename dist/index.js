"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var uuid = require('uuid');
require('./database/mongoose');
var app = express_1.default();
var port = process.env.PORT;
app.get('/', function (req, res) {
    console.log('Home Route');
    res.send(uuid.v4());
});
app.listen((port), function () {
    console.log("On port " + port);
});
//# sourceMappingURL=index.js.map