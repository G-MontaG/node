import express = require('express');
import Boom = require('boom');
import { BaseController } from '../../base.controller';
import { IRequestWithUserId } from '../../request.interface';
import { Budget, IBudgetDocument } from '../../../models/budget.model';

class BudgetListController extends BaseController {
    protected req: IRequestWithUserId;

    public handler() {
        Budget.find({userId: this.req.userId},
            '-_id -userId').lean().exec()
            .then(this.response.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private response(budgets: IBudgetDocument[]) {
        if (!budgets) {
            throw Boom.notFound(`Budgets not found`).output;
        }
        this.res.status(200).send(budgets);
    }
}

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: 'Get all budgets'
 *     description: ''
 *     tags: [API]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 'Budgets find successful'
 *         schema:
 *           type: 'array'
 *           items:
 *              $ref: '#/definitions/BudgetResponse'
 */
export function budgetListHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const budgetListController = new BudgetListController();
    budgetListController.setHandlerParams(req, res, next);
    budgetListController.handler();
}
