import _ = require('lodash');
import express = require('express');
import { IRouterConfiguration } from '../router-configuration.interface';
import { checkTokenMiddleware } from '../../middlewares/check-token.middleware';
import { userUpdateHandler } from './user/update.controller';
import { userGetByIdHandler } from './user/getById.controller';
import { budgetGetByIdHandler } from './budget/getById.controller';

class ApiRouter {
    public routes = express.Router();
    private readonly configurations: IRouterConfiguration[] = [
        {type: 'get', route: '/user', middleware: [checkTokenMiddleware], handler: userGetByIdHandler},
        {type: 'put', route: '/user', middleware: [checkTokenMiddleware], handler: userUpdateHandler},

        {type: 'get', route: '/budgets/:budgetId', middleware: [checkTokenMiddleware], handler: budgetGetByIdHandler},
    ];

    constructor() {
        const configurationsLength = this.configurations.length;
        for (let i = 0; i < configurationsLength; i++) {
            if (this.configurations[i].middleware) {
                this.routes[this.configurations[i].type](
                    this.configurations[i].route,
                    this.configurations[i].middleware,
                    this.configurations[i].handler);
            } else {
                this.routes[this.configurations[i].type](
                    this.configurations[i].route,
                    this.configurations[i].handler);
            }
        }
    }
}

/**
 * @swagger
 * tags:
 *   name: API
 *   description: 'Application API'
 */
export const apiRouter = new ApiRouter();
