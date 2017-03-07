import _ = require('lodash');
import { RouterConfiguration } from './router-configuration';
import express = require('express');

class ApiController {
    public apiRouter = express.Router();
    private readonly configurations: RouterConfiguration[] = [
        {
            type: 'get', route: '/login', handler: this.login
        }
    ];

    constructor() {
        _.forEach(this.configurations, (c) => {
            if (c.middleware) {
                this.apiRouter[c.type](c.route, c.middleware, c.handler);
            } else {
                this.apiRouter[c.type](c.route, c.handler);
            }
        });
    }

    /**
     * @swagger
     * /login:
     *   post:
     *     description: Login to the application
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: username
     *         description: Username to use for login.
     *         in: formData
     *         required: true
     *         type: string
     *       - name: password
     *         description: User's password.
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: login
     */
    private login() {
        console.log('test');
    }
}

export const apiController = new ApiController();
