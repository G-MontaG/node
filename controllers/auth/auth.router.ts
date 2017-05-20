import _ = require('lodash');
import express = require('express');
import { RouterConfiguration } from '../router-configuration';
import { signUpHandler } from './sign-up.controller';

class AuthRouter {
    public routes = express.Router();
    private readonly configurations: RouterConfiguration[] = [
        {
            type: 'post', route: '/sign-up', handler: signUpHandler
        }
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

export const authRouter = new AuthRouter();
