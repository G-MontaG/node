import express = require('express');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import { BaseController } from '../base.controller';
import { IUserDocument, User } from '../../models/user.model';
import { IRequestWithUserId } from '../request.interface';

class ResetPasswordController extends BaseController {
    protected req: IRequestWithUserId;

    protected schema = Joi.object().keys({
        old_password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        confirm_password: Joi.string().valid(Joi.ref('password'))
    }).requiredKeys(['old_password', 'password', 'confirm_password']);

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
            .then(this.checkPassword.bind(this))
            .then(this.verifyResult.bind(this))
            .then(this.cryptPassword.bind(this))
            .then(this.saveUser.bind(this))
            .then(this.responseToken.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private checkUserExist(user: IUserDocument) {
        if (!user) {
            delete this.req.body.old_password;
            throw Boom.unauthorized('User not found').output;
        }
        const oldPassword = this.req.body.old_password;
        delete this.req.body.old_password;
        this.user = user;
        return oldPassword;
    }

    private checkPassword(password) {
        return this.user.checkPassword(password);
    }

    private verifyResult(result) {
        if (!result) {
            throw Boom.badRequest('Incorrect password').output;
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

    private responseToken() {
        this.res.status(200).send({message: 'Password has been changed'});
    }
}

/**
 * @swagger
 * definitions:
 *   ResetPassword:
 *     type: 'object'
 *     properties:
 *       old_password:
 *         type: 'string'
 *         minLength: 3
 *         maxLength: 30
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
 *   ResetPasswordResponse:
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
 *     summary: 'Reset password, send new password and save it'
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
 *           $ref: '#/definitions/ResetPassword'
 *     responses:
 *       200:
 *         description: 'Set new password successful'
 *         schema:
 *           type: 'object'
 *           $ref: '#/definitions/ResetPasswordResponse'
 */
export function resetPasswordHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const resetPasswordController = new ResetPasswordController();
    resetPasswordController.setHandlerParams(req, res, next);
    resetPasswordController.clearData();
    resetPasswordController.handler();
}
