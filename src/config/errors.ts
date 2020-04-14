import {ErrorCode} from '../interface/error-code'
import {ErrorMessage} from '../interface/error-message'

export const error: ErrorCode = {
    invalidParameters : 'invalidParameters',
    invalidEmail : 'invalidEmail',
    invalidMobileNumber : 'invalidMobileNumber',
    emailTaken : 'emailTaken',
    userNotFound : 'userNotFound'
}

export const message: ErrorMessage = {
    invalidParameters : 'Please enter all parameters.',
    invalidEmail : 'Please enter a valid email address.',
    invalidMobileNumber : 'Please enter a valid mobile number.',
    emailTaken : 'An account is already linked to this email.',
    userNotFound : 'User not found.'
}