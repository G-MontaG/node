import express = require('express');
import Boom = require('boom');
import Joi = require('joi');
import { BaseController } from '../../base.controller';
import { IRequestWithUserId } from '../../request.interface';
import { Budget, IBudgetDocument } from '../../../models/budget.model';

class BudgetGetByIdController extends BaseController {
    protected req: IRequestWithUserId;

    protected schema = Joi.object().keys({
        budgetId: Joi.string().length(24),
    }).requiredKeys(['budgetId']);

    public handler() {
        const result = this.validate(this.req.params);
        if (result) {
            this.errorHandler(result);
            return null;
        }

        Budget.findOne({_id: this.req.params.budgetId, userId: this.req.userId},
            '-_id -userId').lean().exec()
            .then(this.response.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private response(budget: IBudgetDocument) {
        if (!budget) {
            throw Boom.notFound(`Budget with ID ${this.req.params.budgetId} not found`).output;
        }
        this.res.status(200).send(budget);
    }
}

/**
 * @swagger
 * definitions:
 *   BudgetResponse:
 *     type: 'object'
 *     properties:
 *       name:
 *         type: 'string'
 *       currency:
 *         type: 'boolean'
 *       numberFormat:
 *         type: 'string'
 *       currencyPlacement:
 *         type: 'string'
 *       dateFormat:
 *         type: 'string'
 *     required:
 *       - name
 *       - currency
 *       - numberFormat
 *       - currencyPlacement
 *       - dateFormat
 */

/**
 * @swagger
 * /api/budgets/{budgetId}:
 *   get:
 *     summary: 'Get budget by ID'
 *     description: ''
 *     tags: [API]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: 'path'
 *         name: 'budgetId'
 *         type: 'string'
 *         required: true
 *         description: 'ID of the budget to get'
 *     responses:
 *       200:
 *         description: 'Budget find successful'
 *         schema:
 *           type: 'object'
 *           $ref: '#/definitions/BudgetResponse'
 */
export function budgetGetByIdHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const budgetGetByIdController = new BudgetGetByIdController();
    budgetGetByIdController.setHandlerParams(req, res, next);
    budgetGetByIdController.handler();
}
