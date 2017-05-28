import express = require('express');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import winston = require('winston');
import { BaseController } from '../base.controller';
import { IUserDocument, User } from '../../models/user.model';
import { transporter } from '../../helpers/constants';
import { IRequestWithUserId } from '../request.interface';

class ResetEmailController extends BaseController {
    protected req: IRequestWithUserId;

    private user: IUserDocument;

    public clearData() {
        this.user = undefined;
    }

    public handler() {
        User.findById(this.req.userId).exec()
            .then(this.checkUserExist.bind(this))
            .then(this.generateToken.bind(this))
            .then(this.saveUser.bind(this))
            .then(this.sendResetEmailVerification.bind(this))
            .then(this.responseToken.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private checkUserExist(user: IUserDocument) {
        if (!user) {
            throw Boom.unauthorized('User not found').output;
        }
        this.user = user;
    }

    private generateToken() {
        return this.user.createResetPasswordToken();
    }

    private saveUser() {
        return this.user.save();
    }

    private sendResetEmailVerification() {
        const mailOptions = {
            to: this.user.email,
            from: 'arthur.osipenko@gmail.com',
            subject: 'Reset password',
            text: `Hello. This is a token for your account 
                   ${this.user.forgotPasswordToken.value}
                   Please go back and enter it in reset password form.`
        };
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                winston.log('error', err);
            }
        });
    }

    private responseToken() {
        this.res.status(200).send({message: 'Token has been sent'});
    }
}

/**
 * @swagger
 * definitions:
 *   ResetEmailResponse:
 *     type: 'object'
 *     properties:
 *       message:
 *         type: 'string'
 *     required:
 *     - message
 */

/**
 * @swagger
 * /auth/reset/email:
 *   post:
 *     summary: 'Reset password, send email token to verify user existing'
 *     description: ''
 *     tags: [Auth]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 'Send email token successful'
 *         schema:
 *           type: 'object'
 *           $ref: '#/definitions/ResetEmailResponse'
 */
export function resetEmailHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const resetEmailController = new ResetEmailController();
    resetEmailController.setHandlerParams(req, res, next);
    resetEmailController.clearData();
    resetEmailController.handler();
}
