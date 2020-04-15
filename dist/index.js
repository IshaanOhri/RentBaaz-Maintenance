"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid = require('uuid');
require('./database/mongoose');
const auth = require('./routes/auth');
const user = require('./routes/user');
const query = require('./routes/query');
const app = express_1.default();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(auth);
app.use(user);
app.use(query);
app.get('/', (req, res) => {
    console.log('Home Route');
    res.send(uuid.v4());
});
app.listen((port), () => {
    console.log(`On port ${port}`);
});
