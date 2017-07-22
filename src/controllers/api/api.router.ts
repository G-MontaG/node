import _ = require('lodash');
import express = require('express');
import { IRouterConfiguration } from '../router-configuration.interface';
import { checkTokenMiddleware } from '../../middlewares/check-token.middleware';
import { userUpdateHandler } from './user/update.controller';
import { userGetByIdHandler } from './user/getById.controller';

class ApiRouter {
    public routes = express.Router();
    private readonly configurations: IRouterConfiguration[] = [
        {type: 'get', route: '/user', middleware: [checkTokenMiddleware], handler: userGetByIdHandler},
        {type: 'put', route: '/user', middleware: [checkTokenMiddleware], handler: userUpdateHandler}
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
 *   name: API
 *   description: 'Application API'
 */
export const apiRouter = new ApiRouter();
