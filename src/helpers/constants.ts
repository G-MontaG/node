import nodemailer = require('nodemailer');
import crypto = require('crypto');

export const nodeID = crypto.randomBytes(32).toString('hex');

export const passwordMinLength = 8;
export const passwordMaxLength = 30;

export const tokenAlg = 'HS512';
export const tokenExp = 7; // days

export const emailConfirmTokenLength = 8; // must be integer
export const emailConfirmTokenExp = 0.5; // hours

export const resetPasswordTokenLength = 8;
export const resetPasswordTokenExp = 0.5;

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
