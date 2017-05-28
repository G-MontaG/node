import express = require('express');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import { BaseController } from '../base.controller';
import { IUserDocument, User } from '../../models/user.model';
import { transporter } from '../../helpers/constants';

class ForgotEmailController extends BaseController {
    protected schema = Joi.object().keys({
        email: Joi.string().email()
    }).requiredKeys(['email']);

    private user: IUserDocument;

    public clearData() {
        this.user = undefined;
    }

    public handler() {
        const result = this.validate();
        if (result) {
            this.errorHandler(result);
            return null;
        }

        User.findOne({email: this.req.body.email}).exec()
            .then(this.checkUserExist.bind(this))
            .then(this.generateToken.bind(this))
            .then(this.saveUser.bind(this))
            .then(this.sendForgotEmailVerification.bind(this))
            .then(this.responseToken.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private checkUserExist(user: IUserDocument) {
        delete this.req.body.email;
        if (!user) {
            throw Boom.badRequest('Email not found').output;
        }
        this.user = user;
    }

    private generateToken() {
        return this.user.createForgotPasswordToken();
    }

    private saveUser() {
        return this.user.save();
    }

    private sendForgotEmailVerification() {
        const mailOptions = {
            to: this.user.email,
            from: 'arthur.osipenko@gmail.com',
            subject: 'Forgot password',
            text: `Hello. This is a token for your account 
                   ${this.user.forgotPasswordToken.value}
                   Please go back and enter it in forgot password form.`
        };
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error(err);
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
 *   ForgotEmail:
 *     type: 'object'
 *     properties:
 *       email:
 *         type: 'string'
 *     required:
 *     - email
 */

/**
 * @swagger
 * definitions:
 *   ForgotEmailResponse:
 *     type: 'object'
 *     properties:
 *       message:
 *         type: 'string'
 *     required:
 *     - message
 */

/**
 * @swagger
 * /auth/forgot/email:
 *   post:
 *     summary: 'Forgot password, send email to verify user existing'
 *     description: ''
 *     tags: [Auth]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: 'body'
 *         name: 'body'
 *         description: ''
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ForgotEmail'
 *     responses:
 *       200:
 *         description: 'Verify email successful'
 *         schema:
 *           type: 'object'
 *           $ref: '#/definitions/ForgotEmailResponse'
 */
export function forgotEmailHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const forgotEmailController = new ForgotEmailController();
    forgotEmailController.setHandlerParams(req, res, next);
    forgotEmailController.clearData();
    forgotEmailController.handler();
}
