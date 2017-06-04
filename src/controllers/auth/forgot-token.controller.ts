import express = require('express');
import moment = require('moment');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import { BaseController } from '../base.controller';
import { IUserDocument, User } from '../../models/user.model';
import { tokenAlg, tokenExp } from '../../helpers/constants';

class ForgotTokenController extends BaseController {
    protected schema = Joi.object().keys({
        email: Joi.string().email(),
        token: Joi.string().length(8),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        confirm_password: Joi.string().valid(Joi.ref('password'))
    }).requiredKeys(['email', 'token', 'password', 'confirm_password']);

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
            .then(this.checkToken.bind(this))
            .then(this.cryptPassword.bind(this))
            .then(this.saveUser.bind(this))
            .then(this.response.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private checkToken(user: IUserDocument) {
        const token = this.req.body.token;
        delete this.req.body.token;
        delete this.req.body.email;
        if (!user || !user.forgotPasswordToken) {
            throw Boom.badRequest('Token not found').output;
        } else if (user.forgotPasswordToken.value !== token) {
            throw Boom.badRequest('Token not found').output;
        } else if (moment() > moment.unix(user.forgotPasswordToken.exp)) {
            throw Boom.badRequest('Token expired').output;
        } else {
            user.setForgotPasswordTokenUsed();
            this.user = user;
        }
    }

    private cryptPassword() {
        return this.user.cryptPassword(this.req.body.password);
    }

    private saveUser() {
        delete this.req.body.password;
        delete this.req.body.confirm_password;
        return this.user.save();
    }

    private response() {
        const token = jwt.sign({
            'id': this.user.id,
            'user-agent': this.req.headers['user-agent']
        }, process.env.JWT_SECRET, {
            algorithm: tokenAlg,
            expiresIn: `${tokenExp}d`,
            jwtid: process.env.JWT_ID
        });
        this.res.status(200).send({message: 'Password has been changed', token});
    }
}

/**
 * @swagger
 * definitions:
 *   ForgotToken:
 *     type: 'object'
 *     properties:
 *       token:
 *         type: 'string'
 *       email:
 *         type: 'string'
 *       password:
 *         type: 'string'
 *         minLength: 3
 *         maxLength: 30
 *       confirm_password:
 *         type: 'string'
 *         minLength: 3
 *         maxLength: 30
 *     required:
 *     - token
 *     - email
 *     - password
 *     - confirm_password
 */

/**
 * @swagger
 * definitions:
 *   ForgotTokenResponse:
 *     type: 'object'
 *     properties:
 *       message:
 *         type: 'string'
 *       token:
 *          type: 'string'
 *     required:
 *     - message
 *     - token
 */

/**
 * @swagger
 * /auth/forgot/token:
 *   post:
 *     summary: 'Forgot password, verify token from email and set new password'
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
 *           $ref: '#/definitions/ForgotToken'
 *     responses:
 *       200:
 *         description: 'Verify token and set new password successful'
 *         schema:
 *           type: 'object'
 *           $ref: '#/definitions/ForgotTokenResponse'
 */
export function forgotTokenHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const forgotTokenController = new ForgotTokenController();
    forgotTokenController.setHandlerParams(req, res, next);
    forgotTokenController.clearData();
    forgotTokenController.handler();
}
