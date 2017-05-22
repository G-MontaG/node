import express = require('express');
import moment = require('moment');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import { BaseController } from '../base.controller';
import { IUserDocument, User } from '../../models/user.model';

class VerifyEmailController extends BaseController {
    protected schema = Joi.object().keys({
        token: Joi.string().length(8),
    }).requiredKeys(['token']);

    public handler() {
        const result = this.validate();
        if (result) {
            this.errorHandler(result);
            return null;
        }

        User.findOne({'emailVerifyToken.value': this.req.body.token}).exec()
            .then(this.checkToken.bind(this))
            .then(this.response.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private checkToken(user: IUserDocument) {
        if (!user) {
            throw Boom.badRequest('Token not found').output;
        } else if (moment() > moment.unix(user.emailVerifyToken.exp)) {
            throw Boom.badRequest('Token expired').output;
        } else {
            delete this.req.body.token;
            user.emailVerifyToken = undefined;
            user.emailConfirmed = true;
            return user.save();
        }
    }

    private response() {
        this.res.status(200).send({message: 'Email is confirmed'});
    }
}

export function verifyEmailHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const verifyEmailController = new VerifyEmailController();
    verifyEmailController.setHandlerParams(req, res, next);
    verifyEmailController.handler();
}
