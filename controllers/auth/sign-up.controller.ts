import express = require('express');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import { IUserDocument, User } from '../../models/user.model';
import { tokenAlg, tokenExp, transporter } from '../../helpers/constants';

class SignUpController {
    private req: express.Request;
    private res: express.Response;
    private next: express.NextFunction;

    private newUser: IUserDocument;

    private schema = Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    }).requiredKeys(['email', 'password']);

    public setHandlerParams(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.req = req;
        this.res = res;
        this.next = next;

        this.newUser = undefined;
    }

    public handler() {
        this.validate();

        User.findOne({email: this.req.body.email}).exec()
            .then(this.checkUserExist.bind(this))
            .then(this.createUser.bind(this))
            .then(this.saveUser.bind(this))
            .then(this.sendEmailVerification.bind(this))
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
        if (user) {
            throw Boom.conflict('Email is already in use').output;
        }
        const password = this.req.body.password;
        delete this.req.body.password;
        return password;
    }

    private createUser(password) {
        this.newUser = new User(this.req.body);
        this.newUser.createEmailVerifyToken();
        return this.newUser.cryptPassword(password);
    }

    private saveUser() {
        return this.newUser.save();
    }

    private sendEmailVerification() {
        const mailOptions = {
            to: this.newUser.email,
            from: 'arthur.osipenko@gmail.com',
            subject: 'Hello on XXX',
            text: `Hello. This is a token for your account 
                   ${this.newUser.emailVerifyToken.value}
                   Please go back and enter it in your profile to verify your email.`
        };
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    private responseToken() {
        const token = jwt.sign({
            'id': this.newUser._id,
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

export function signUpHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const signUpController = new SignUpController();
    signUpController.setHandlerParams(req, res, next);
    signUpController.handler();
}
