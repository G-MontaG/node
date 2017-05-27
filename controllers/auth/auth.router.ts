import _ = require('lodash');
import express = require('express');
import { IRouterConfiguration } from '../router-configuration.interface';
import { checkTokenMiddleware } from '../../middlewares/check-token.middleware';
import { signUpHandler } from './sign-up.controller';
import { loginHandler } from './login.controller';
import { verifyEmailHandler } from './verify-email.controller';
import { forgotEmailHandler } from './forgot-email-handler.controller';

class AuthRouter {
    public routes = express.Router();
    private readonly configurations: IRouterConfiguration[] = [
        {type: 'post', route: '/sign-up', handler: signUpHandler},
        {type: 'post', route: '/login', handler: loginHandler},
        {type: 'post', route: '/verify-email', middleware: [checkTokenMiddleware], handler: verifyEmailHandler},
        {type: 'post', route: '/forgot/email', handler: forgotEmailHandler}
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
