import _ = require('lodash');
import express = require('express');
import { IRouterConfiguration } from '../router-configuration.interface';
import { checkTokenMiddleware } from '../../middlewares/check-token.middleware';
import { signUpHandler } from './sign-up.controller';
import { loginHandler } from './login.controller';
import { verifyEmailHandler } from './verify-email.controller';
import { forgotEmailHandler } from './forgot-email.controller';
import { forgotTokenHandler } from './forgot-token.controller';
import { forgotPasswordHandler } from './forgot-password.controller';
import { resetEmailHandler } from './reset-email.controller';
import { resetTokenHandler } from './reset-token.controller';
import { resetPasswordHandler } from './reset-password.controller';

class AuthRouter {
    public routes = express.Router();
    private readonly configurations: IRouterConfiguration[] = [
        {type: 'post', route: '/sign-up', handler: signUpHandler},
        {type: 'post', route: '/login', handler: loginHandler},
        {type: 'post', route: '/verify-email', middleware: [checkTokenMiddleware], handler: verifyEmailHandler},
        {type: 'post', route: '/forgot/email', handler: forgotEmailHandler},
        {type: 'post', route: '/forgot/token', handler: forgotTokenHandler},
        {type: 'post', route: '/forgot/password', middleware: [checkTokenMiddleware], handler: forgotPasswordHandler},
        {type: 'post', route: '/reset/email', middleware: [checkTokenMiddleware], handler: resetEmailHandler},
        {type: 'post', route: '/reset/token', middleware: [checkTokenMiddleware], handler: resetTokenHandler},
        {type: 'post', route: '/reset/password', middleware: [checkTokenMiddleware], handler: resetPasswordHandler}
    ];

    constructor() {
        _.forEach(this.configurations, (c) => {
            if (c.middleware) {
                this.routes[c.type](c.route, c.middleware, c.handler);
            } else {
                this.routes[c.type](c.route, c.handler);
            }
        });
    }
}

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 'Application authorization'
 */

/**
 * @swagger
 * securityDefinitions:
 *   Authorization:
 *     type: 'apiKey'
 *     name: 'Authorization'
 *     in: 'header'
 */

/**
 * @swagger
 * definitions:
 *   AuthTokenResponse:
 *     required:
 *       - message
 *       - token
 *     properties:
 *       message:
 *         type: string
 *       token:
 *         type: string
 */
export const authRouter = new AuthRouter();
