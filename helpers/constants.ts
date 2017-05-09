
import nodemailer = require('nodemailer');

export const passwordMinLength = 8;
export const passwordMaxLength = 30;

export const tokenAlg = 'HS512';
export const tokenExp = 7; // days

export const emailTokenLength = 8; // целое число или допиши округление в postForgotPasswordEmail
export const emailTokenExp = 0.5; // hours

export const expTimeAttempts = 1; // hours

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    debug: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});
