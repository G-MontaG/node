import express = require('express');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import { IUserDocument, User } from '../../models/user.model';
import { transporter } from '../../helpers/constants';

class SignUpController {
    private req: express.Request;
    private res: express.Response;
    private next: express.NextFunction;

    private schema = Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    }).requiredKeys(['email', 'password']);

    public signUpHandler() {
        this.validate();
        User.findOne({email: this.req.body.email}).exec()
            .then((user: IUserDocument) => {
                if (user) {
                    throw Boom.conflict('Email is already in use').output;
                } else {
                    const password = this.req.body.password;
                    delete this.req.body.password;
                    const newUser = new User(this.req.body);
                    newUser.createEmailVerifyToken();
                    newUser.cryptPassword(password);
                    return newUser;
                }
            })
            .then((newUser: IUserDocument) => {
                return newUser.save();
            })
            .then((newUser: IUserDocument) => {
                const mailOptions = {
                    to: newUser.email,
                    from: 'arthur.osipenko@gmail.com',
                    subject: 'Hello on XXX',
                    text: `Hello. This is a token for your account 
                           ${newUser.emailVerifyToken.value}
                           Please go back and enter it in your profile to verify your email.`
                };
                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        console.log(err);
                        throw Boom.badImplementation('Send email error').output;
                    }
                });
            })
            .catch(this.errorHandler.bind(this));
    }

    public setHandlerParams(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.req = req;
        this.res = res;
        this.next = next;
    }

    private validate() {
        Joi.validate(this.req.body, this.schema, (validationError, value) => {
            if (!validationError) {
                return null;
            }
            const error = Boom.badRequest().output;
            this.res.status(error.statusCode).send({
                statusCode: error.statusCode,
                error: validationError.details,
                message: validationError.name
            });
        });
    }

    private errorHandler(err) {
        if (!err.statusCode || !err.payload) {
            this.next(err);
        }
        this.res.status(err.statusCode).send(err.payload);
    }
}

const signUpController = new SignUpController();

export function signUpHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    signUpController.setHandlerParams(req, res, next);
    signUpController.signUpHandler();
}
