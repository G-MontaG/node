import express = require('express');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import { BaseController } from '../base.controller';
import { IUserDocument, User } from '../../models/user.model';
import { IRequestWithUserId } from '../request.interface';

class ForgotPasswordController extends BaseController {
    protected req: IRequestWithUserId;

    protected schema = Joi.object().keys({
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        confirm_password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    }).requiredKeys(['password', 'confirm_password']);

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
            .then(this.checkUserExist.bind(this))
            .then(this.cryptPassword.bind(this))
            .then(this.saveUser.bind(this))
            .then(this.responseToken.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private checkUserExist(user: IUserDocument) {
        if (!user) {
            throw Boom.unauthorized('User not found').output;
        }
        this.user = user;
    }

    private cryptPassword() {
        return this.user.cryptPassword(this.req.body.password);
    }

    private saveUser() {
        return this.user.save();
    }

    private responseToken() {
        this.res.status(200).send({message: 'Password has been changed'});
    }
}

/**
 * @swagger
 * definitions:
 *   ForgotPassword:
 *     type: 'object'
 *     properties:
 *       password:
 *         type: 'string'
 *         minLength: 3
 *         maxLength: 30
 *       confirm_password:
 *         type: 'string'
 *         minLength: 3
 *         maxLength: 30
 *     required:
 *     - password
 *     - confirm_password
 */

/**
 * @swagger
 * definitions:
 *   ForgotPasswordResponse:
 *     type: 'object'
 *     properties:
 *       message:
 *         type: 'string'
 *     required:
 *     - message
 */

/**
 * @swagger
 * /auth/forgot/password:
 *   post:
 *     summary: 'Forgot password, send new password and save it'
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
 *           $ref: '#/definitions/ForgotPassword'
 *     responses:
 *       200:
 *         description: 'Set new password successful'
 *         schema:
 *           type: 'object'
 *           $ref: '#/definitions/ForgotPasswordResponse'
 */
export function forgotPasswordHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const forgotPasswordController = new ForgotPasswordController();
    forgotPasswordController.setHandlerParams(req, res, next);
    forgotPasswordController.clearData();
    forgotPasswordController.handler();
}
