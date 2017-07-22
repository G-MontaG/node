import express = require('express');
import { BaseController } from '../../base.controller';
import { IUserDocument, User } from '../../../models/user.model';
import { IRequestWithUserId } from '../../request.interface';

class UserGetByIdController extends BaseController {
    protected req: IRequestWithUserId;

    public handler() {
        User.findById(this.req.userId, 'emailConfirmed profile').lean().exec()
            .then(this.response.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private response(user: IUserDocument) {
        this.res.status(200).send({emailConfirmed: user.emailConfirmed, ...user.profile});
    }
}

/**
 * @swagger
 * definitions:
 *   UserResponse:
 *     type: 'object'
 *     properties:
 *       emailConfirmed:
 *         type: 'boolean'
 *       first_name:
 *         type: 'string'
 *       last_name:
 *         type: 'string'
 *       gender:
 *         type: 'string'
 *       language:
 *         type: 'string'
 *     required:
 *       - emailConfirmed
 *       - first_name
 *       - last_name
 *       - gender
 *       - language
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: 'Get user by ID'
 *     description: ''
 *     tags: [API]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 'User find successful'
 *         schema:
 *           type: 'object'
 *           $ref: '#/definitions/UserResponse'
 */
export function userGetByIdHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const userGetByIdController = new UserGetByIdController();
    userGetByIdController.setHandlerParams(req, res, next);
    userGetByIdController.handler();
}
