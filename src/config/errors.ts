import {ErrorCode} from '../interface/error-code'
import {ErrorMessage} from '../interface/error-message'

export const error: ErrorCode = {
    invalidParameters : 'invalidParameters',
    invalidEmail : 'invalidEmail',
    invalidMobileNumber : 'invalidMobileNumber',
    invalidPassword : 'invalidPassword',
    emailTaken : 'emailTaken',
    userNotFound : 'userNotFound',
    wrongParameters : 'wrongParameters',
    Unauthorized : 'Unauthorized',
    wrongPswd : 'Error',
    invalidVerification : 'invalidVerification',
    verificationExpired : 'verificationExpired',
    notFound : 'notFound',
    incorrectPassword : 'incorrectPassword' 
}

export const message: ErrorMessage = {
    invalidParameters : 'Please enter all parameters.',
    invalidEmail : 'Please enter a valid email address.',
    invalidMobileNumber : 'Please enter a valid mobile number.',
    invalidPassword : 'Invalid password. Password must contain', //Add Password Rule
    emailTaken : 'An account is already linked to this email.',
    userNotFound : 'User not found.',
    wrongParameters: 'An internal error occured. This incident has been reported',
    Unauthorized : 'Access denied. Please authenticate',
    wrongPswd : 'An error occured while updating password',
    invalidVerification : 'Invalid verification link. Please Sign Up.',
    verificationExpired : 'Verification link has expired, please sign up again.',
    notFound : 'could not find the requested resource',
    incorrectPassword : 'The entered password is incorrect. Please try again.'
}