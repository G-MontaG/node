import express = require('express');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import Joi = require('joi');

export abstract class BaseMiddleware {
    protected req: express.Request | any;
    protected res: express.Response;
    protected next: express.NextFunction;

    public setHandlerParams(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.req = req;
        this.res = res;
        this.next = next;
    }

    public abstract middleware();

    protected errorHandler(err) {
        if (!err.statusCode || !err.payload) {
            this.next(err);
        }
        this.res.status(err.statusCode).send(err.payload);
    }
}
