
import nodemailer = require('nodemailer');

export const passwordMinLength = 8;
export const passwordMaxLength = 30;

export const tokenAlg = 'HS512';
export const tokenExp = 7; // days

export const emailConfirmTokenLength = 8; // must be integer
export const emailConfirmTokenExp = 0.5; // hours

export const passwordResetTokenLength = 8;
export const passwordResetTokenExp = 0.5;

export const forgotPasswordTokenLength = 8;
export const forgotPasswordTokenExp = 0.5;

export const expTimeAttempts = 1; // hours

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    debug: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});
