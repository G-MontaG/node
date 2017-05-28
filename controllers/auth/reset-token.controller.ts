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
    }).requiredKeys(['token']);

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
            .then(this.response.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private checkToken(user: IUserDocument) {
        delete this.req.body.token;
        if (!user || !user.resetPasswordToken) {
            throw Boom.badRequest('Token not found').output;
        } else if (moment() > moment.unix(user.resetPasswordToken.exp)) {
            throw Boom.badRequest('Token expired').output;
        } else {
            user.setResetPasswordTokenUsed();
            this.user = user;
            return user.save();
        }
    }

    private response() {
        this.res.status(200).send({message: 'Token is valid'});
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
