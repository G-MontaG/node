import _ = require('lodash');
import express = require('express');
import { IRouterConfiguration } from '../router-configuration.interface';
import { checkTokenMiddleware } from '../../middlewares/check-token.middleware';
import { nodeID } from '../../helpers/constants';

class ApiRouter {
    public routes = express.Router();
    private readonly configurations: IRouterConfiguration[] = [
        {type: 'get', route: '/test', middleware: [checkTokenMiddleware], handler: this.test}
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
    private test(req, res, next) {
        // throw new Error('booom');
        res.status(200).send({id: nodeID, test: 'test2222'});
    }
}

export const apiRouter = new ApiRouter();
