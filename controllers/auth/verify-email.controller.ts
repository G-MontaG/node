import express = require('express');
import moment = require('moment');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import { BaseController } from '../base.controller';
import { IUserDocument, User } from '../../models/user.model';
import { IRequestWithUserId } from '../request.interface';

class VerifyEmailController extends BaseController {
    protected req: IRequestWithUserId;

    protected schema = Joi.object().keys({
        token: Joi.string().length(8),
    }).requiredKeys(['token']);

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
        if (!user) {
            throw Boom.unauthorized('User not found').output;
        } else if (!user.emailVerifyToken) {
            throw Boom.badRequest('Token not found').output;
        } else if (moment() > moment.unix(user.emailVerifyToken.exp)) {
            throw Boom.badRequest('Token expired').output;
        } else {
            user.emailVerifyToken = undefined;
            user.emailConfirmed = true;
            return user.save();
        }
    }

    private response() {
        this.res.status(200).send({message: 'Email is confirmed'});
    }
}

/**
 * @swagger
 * definitions:
 *   VerifyEmail:
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
 *   VerifyEmailResponse:
 *     type: 'object'
 *     properties:
 *       message:
 *         type: 'string'
 *     required:
 *     - message
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: 'Verify user email'
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
 *           $ref: '#/definitions/VerifyEmail'
 *     responses:
 *       200:
 *         description: 'Verify email successful'
 *         schema:
 *           type: 'object'
 *           $ref: '#/definitions/VerifyEmailResponse'
 *     security:
 *       - Authorization: []
 */
export function verifyEmailHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const verifyEmailController = new VerifyEmailController();
    verifyEmailController.setHandlerParams(req, res, next);
    verifyEmailController.handler();
}
