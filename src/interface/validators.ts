const validator = require('validator');

export function isPasswordValid(password: string): boolean {
    // ADD RULE HERE

    return true;
}

export function isMobileNumberValid(mobileNumber: string): boolean {
    //ADD RULE HERE

    return true;
}

export function isEmailValid(email: string): boolean {
    return validator.isEmail(email);
}