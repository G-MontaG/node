import _ = require('lodash');
import express = require('express');
import { RouterConfiguration } from '../router-configuration';
import { User } from '../../models/user.model';

class ApiRouter {
    public routes = express.Router();
    private readonly configurations: RouterConfiguration[] = [
        {
            type: 'get', route: '/test', handler: this.test
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

    /**
     * @swagger
     * /api/test:
     *   get:
     *     description: test the application
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: test
     */
    private test() {
        console.log('test');
    }
}

export const apiRouter = new ApiRouter();
