import express = require('express');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import { BaseController } from '../base.controller';
import { IUserDocument, User } from '../../models/user.model';
import { tokenAlg, tokenExp } from '../../helpers/constants';

class LoginController extends BaseController {
    protected schema = Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    }).requiredKeys(['email', 'password']);

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
            .then(this.checkPassword.bind(this))
            .then(this.verifyResult.bind(this))
            .then(this.responseToken.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private checkUserExist(user: IUserDocument) {
        if (!user) {
            throw Boom.unauthorized('Email not found').output;
        }
        const password = this.req.body.password;
        delete this.req.body.password;
        delete this.req.body.email;
        this.user = user;
        return password;
    }

    private checkPassword(password) {
        return this.user.checkPassword(password);
    }

    private verifyResult(result) {
        if (!result) {
            throw Boom.unauthorized('Incorrect password').output;
        }
    }

    private responseToken() {
        const token = jwt.sign({
            'id': this.user.id,
            'user-agent': this.req.headers['user-agent']
        }, process.env.JWT_SECRET, {
            algorithm: tokenAlg,
            expiresIn: `${tokenExp}d`,
            jwtid: process.env.JWT_ID
        });
        this.res.status(200).send({message: 'User is authorized', token});
    }
}

export function loginHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const loginController = new LoginController();
    loginController.setHandlerParams(req, res, next);
    loginController.clearData();
    loginController.handler();
}
