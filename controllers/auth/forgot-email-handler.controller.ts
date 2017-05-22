import express = require('express');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import { BaseController } from '../base.controller';
import { IUserDocument, User } from '../../models/user.model';
import { transporter } from '../../helpers/constants';

class ForgotEmailHandlerController extends BaseController {
    protected schema = Joi.object().keys({
        email: Joi.string().email()
    }).requiredKeys(['email']);

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
            .then(this.generateToken.bind(this))
            .then(this.saveUser.bind(this))
            .then(this.sendForgotEmailVerification.bind(this))
            .then(this.responseToken.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private checkUserExist(user: IUserDocument) {
        if (!user) {
            throw Boom.badRequest('Email not found').output;
        }
        delete this.req.body.email;
        this.user = user;
    }

    private generateToken() {
        return this.user.createForgotPasswordToken();
    }

    private saveUser() {
        return this.user.save();
    }

    private sendForgotEmailVerification() {
        const mailOptions = {
            to: this.user.email,
            from: 'arthur.osipenko@gmail.com',
            subject: 'Forgot password',
            text: `Hello. This is a token for your account 
                   ${this.user.forgotPasswordToken.value}
                   Please go back and enter it in forgot password form.`
        };
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    private responseToken() {
        this.res.status(200).send({message: 'Email verified'});
    }
}

export function forgotEmailHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const forgotEmailHandlerController = new ForgotEmailHandlerController();
    forgotEmailHandlerController.setHandlerParams(req, res, next);
    forgotEmailHandlerController.clearData();
    forgotEmailHandlerController.handler();
}
