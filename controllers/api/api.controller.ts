import _ = require('lodash');
import express = require('express');
import { RouterConfiguration } from '../router-configuration';
import { User } from '../../models/user.model';

class ApiController {
    public apiRouter = express.Router();
    private readonly configurations: RouterConfiguration[] = [
        {
            type: 'get', route: '/test', handler: this.test
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
        const user = new User({
            email: 'test@test.com'
        });
        user.save((err) => {
            if (err) {
                return console.log(err);
            }
        });
    }
}

export const apiController = new ApiController();
