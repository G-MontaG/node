import _ = require('lodash');
import { RouterConfiguration } from './router-configuration';

export let apiRouter = require('express').Router();

export class ApiController {
    public configurations: Array<RouterConfiguration>;

    constructor() {
        this.configurations = [
            {
                type: 'get', route: '/login', handler: this.login
            }
        ];

        _.forEach(this.configurations, (c) => {
            if (c.middleware) {
                apiRouter[c.type](c.route, c.middleware, c.handler);
            } else {
                apiRouter[c.type](c.route, c.handler);
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


