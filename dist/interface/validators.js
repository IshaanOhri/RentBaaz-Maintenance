"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require('validator');
function isPasswordValid(password) {
    // ADD RULE HERE
    return true;
}
exports.isPasswordValid = isPasswordValid;
function isMobileNumberValid(mobileNumber) {
    //ADD RULE HERE
    return true;
}
exports.isMobileNumberValid = isMobileNumberValid;
function isEmailValid(email) {
    return validator.isEmail(email);
}
exports.isEmailValid = isEmailValid;
