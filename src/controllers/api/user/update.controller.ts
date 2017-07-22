import express = require('express');
import Joi = require('joi');
import { BaseController } from '../../base.controller';
import { User } from '../../../models/user.model';
import { IRequestWithUserId } from '../../request.interface';

class UserUpdateController extends BaseController {
    protected req: IRequestWithUserId;

    protected schema = Joi.object().keys({
        first_name: Joi.string().min(2).max(100).truncate(),
        last_name: Joi.string().min(2).max(100).truncate(),
        gender: Joi.string().valid('male', 'female'),
        language: Joi.string()
    });

    public handler() {
        const result = this.validate();
        if (result) {
            this.errorHandler(result);
            return null;
        }

        User.findByIdAndUpdate(this.req.userId,
            {profile: {...this.req.body}},
            {select: 'profile'}).lean().exec()
            .then(this.response.bind(this))
            .catch(this.errorHandler.bind(this));
    }

    private response(user) {
        this.res.status(200).send({message: 'User is updated', user: {...user.profile}});
    }
}

/**
 * @swagger
 * definitions:
 *   UserUpdate:
 *     type: 'object'
 *     properties:
 *       first_name:
 *         type: 'string'
 *         minLength: 2
 *         maxLength: 100
 *       last_name:
 *         type: 'string'
 *         minLength: 2
 *         maxLength: 100
 *       gender:
 *         type: 'string'
 *       language:
 *         type: 'string'
 */

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: 'User profile update'
 *     description: ''
 *     tags: [API]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: 'body'
 *         name: 'body'
 *         description: 'Update info'
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserUpdate'
 *       - in: path
 *         name: userId
 *         type: integer
 *         required: true
 *         description: Numeric ID of the user to update.
 *     responses:
 *       200:
 *         description: 'User update successful'
 *         schema:
 *           type: 'object'
 *           $ref: '#/definitions/UserResponse'
 */
export function userUpdateHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const userUpdateController = new UserUpdateController();
    userUpdateController.setHandlerParams(req, res, next);
    userUpdateController.handler();
}
