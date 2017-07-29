import express = require('express');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');
import winston = require('winston');
import { BaseController } from '../base.controller';
import { IUserDocument, User } from '../../models/user.model';
import { tokenAlg, tokenExp, transporter } from '../../helpers/constants';

class SignUpController extends BaseController {
    protected schema = Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    }).requiredKeys(['email', 'password']);

    private newUser: IUserDocument;

    public clearData() {
        this.newUser = undefined;
    }

    public handler() {
        const result = this.validate(this.req.body);
        if (result) {
            this.errorHandler(result);
            return null;
        }

        User.findOne({email: this.req.body.email}).exec()
            .then(this.checkUserExist.bind(this))
            .then(this.createUser.bind(this))
            .then(this.saveUser.bind(this))
            .then(this.sendEmailVerification.bind(this))
            .then(this.responseToken.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private checkUserExist(user: IUserDocument) {
        if (user) {
            delete this.req.body.password;
            throw Boom.conflict('Email is already in use').output;
        }
        const password = this.req.body.password;
        delete this.req.body.password;
        return password;
    }

    private createUser(password) {
        this.newUser = new User(this.req.body);
        delete this.req.body.email;
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
                winston.log('error', err);
            }
        });
    }

    private responseToken() {
        const token = jwt.sign({
            'id': this.newUser.id,
            'user-agent': this.req.headers['user-agent']
        }, process.env.JWT_SECRET, {
            algorithm: tokenAlg,
            expiresIn: `${tokenExp}d`,
            jwtid: process.env.JWT_ID
        });
        this.res.status(200).send({message: 'User is authorized', token});
    }
}

/**
 * @swagger
 * definitions:
 *   SignUp:
 *     type: 'object'
 *     properties:
 *       email:
 *         type: 'string'
 *       password:
 *         type: 'string'
 *         minLength: 3
 *         maxLength: 30
 *     required:
 *     - email
 *     - password
 */

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     summary: 'Sign-up to the application'
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
 *           $ref: '#/definitions/SignUp'
 *     responses:
 *       200:
 *         description: 'Sign-up successful'
 *         schema:
 *           type: 'object'
 *           $ref: '#/definitions/AuthTokenResponse'
 */
export function signUpHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const signUpController = new SignUpController();
    signUpController.setHandlerParams(req, res, next);
    signUpController.clearData();
    signUpController.handler();
}
