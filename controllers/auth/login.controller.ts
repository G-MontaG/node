import express = require('express');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import { IUserDocument, User } from '../../models/user.model';
import { tokenAlg, tokenExp, transporter } from '../../helpers/constants';

class LoginController {
    private req: express.Request;
    private res: express.Response;
    private next: express.NextFunction;

    private user: IUserDocument;

    private schema = Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    }).requiredKeys(['email', 'password']);

    public setHandlerParams(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.req = req;
        this.res = res;
        this.next = next;

        this.user = undefined;
    }

    public handler() {
        this.validate();

        User.findOne({email: this.req.body.email}).exec()
            .then(this.checkUserExist.bind(this))
            .then(this.checkPassword.bind(this))
            .then(this.verifyResult.bind(this))
            .then(this.responseToken.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private validate() {
        Joi.validate(this.req.body, this.schema, (validationError, value) => {
            if (!validationError) {
                return null;
            }
            const error = Boom.badRequest().output;
            error.payload = {
                statusCode: error.statusCode,
                error: validationError.details,
                message: validationError.name
            };
            throw error;
        });
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

    private errorHandler(err) {
        if (!err.statusCode || !err.payload) {
            this.next(err);
        }
        this.res.status(err.statusCode).send(err.payload);
    }
}

export function loginHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const loginController = new LoginController();
    loginController.setHandlerParams(req, res, next);
    loginController.handler();
}
