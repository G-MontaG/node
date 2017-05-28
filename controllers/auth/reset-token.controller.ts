import express = require('express');
import moment = require('moment');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import { BaseController } from '../base.controller';
import { IUserDocument, User } from '../../models/user.model';
import { tokenAlg, tokenExp } from '../../helpers/constants';
import { IRequestWithUserId } from '../request.interface';

class ResetTokenController extends BaseController {
    protected req: IRequestWithUserId;

    protected schema = Joi.object().keys({
        token: Joi.string().length(8),
        old_password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        confirm_password: Joi.string().valid(Joi.ref('password'))
    }).requiredKeys(['token', 'old_password', 'password', 'confirm_password']);

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

        User.findById(this.req.userId).exec()
            .then(this.checkToken.bind(this))
            .then(this.checkPassword.bind(this))
            .then(this.verifyResult.bind(this))
            .then(this.cryptPassword.bind(this))
            .then(this.saveUser.bind(this))
            .then(this.response.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private checkToken(user: IUserDocument) {
        const token = this.req.body.token;
        delete this.req.body.token;
        if (!user || !user.resetPasswordToken) {
            throw Boom.badRequest('Token not found').output;
        } else if (user.resetPasswordToken.value !== token) {
            throw Boom.badRequest('Token not found').output;
        } else if (moment() > moment.unix(user.resetPasswordToken.exp)) {
            throw Boom.badRequest('Token expired').output;
        } else {
            user.setResetPasswordTokenUsed();
            this.user = user;
        }
    }

    private checkPassword() {
        return this.user.checkPassword(this.req.body.old_password);
    }

    private verifyResult(result) {
        if (!result) {
            delete this.req.body.old_password;
            delete this.req.body.password;
            delete this.req.body.confirm_password;
            throw Boom.badRequest('Incorrect password').output;
        }
    }

    private cryptPassword() {
        return this.user.cryptPassword(this.req.body.password);
    }

    private saveUser() {
        delete this.req.body.old_password;
        delete this.req.body.password;
        delete this.req.body.confirm_password;
        return this.user.save();
    }

    private response() {
        this.res.status(200).send({message: 'Password has been changed'});
    }
}

/**
 * @swagger
 * definitions:
 *   ResetToken:
 *     type: 'object'
 *     properties:
 *       token:
 *         type: 'string'
 *     required:
 *     - token
 */

/**
 * @swagger
 * definitions:
 *   ResetTokenResponse:
 *     type: 'object'
 *     properties:
 *       message:
 *         type: 'string'
 *     required:
 *     - message
 */

/**
 * @swagger
 * /auth/reset/token:
 *   post:
 *     summary: 'Reset password, verify token from email'
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
 *           $ref: '#/definitions/ResetToken'
 *     responses:
 *       200:
 *         description: 'Verify token successful'
 *         schema:
 *           type: 'object'
 *           $ref: '#/definitions/ResetTokenResponse'
 */
export function resetTokenHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const resetTokenController = new ResetTokenController();
    resetTokenController.setHandlerParams(req, res, next);
    resetTokenController.clearData();
    resetTokenController.handler();
}
