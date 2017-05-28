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
    }).requiredKeys(['email', 'token']);

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
            .then(this.response.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private checkToken(user: IUserDocument) {
        delete this.req.body.token;
        if (!user || !user.forgotPasswordToken) {
            throw Boom.badRequest('Token not found').output;
        } else if (moment() > moment.unix(user.forgotPasswordToken.exp)) {
            throw Boom.badRequest('Token expired').output;
        } else {
            user.forgotPasswordToken = undefined;
            this.user = user;
            return user.save();
        }
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
        this.res.status(200).send({message: 'Token is valid', token});
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
 *     required:
 *     - token
 *     - email
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
 *     summary: 'Forgot password, verify token from email'
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
 *         description: 'Verify token successful'
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
