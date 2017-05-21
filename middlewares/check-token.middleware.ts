import express = require('express');
import jwt = require('jsonwebtoken');
import Boom = require('boom');
import { BaseMiddleware } from './base.middleware';

class CheckTokenMiddleware extends BaseMiddleware {
    public middleware() {
        new Promise((resolve, reject) => {
            if (!this.req.get('Authorization')) {
                reject(Boom.unauthorized('Token is undefined').output);
            }
            jwt.verify(this.req.get('Authorization').split(' ')[1], process.env.JWT_SECRET, {
                jwtid: process.env.JWT_ID
            }, (err, payload) => {
                if (err) {
                    reject(Boom.unauthorized('Invalid token').output);
                } else if (payload['user-agent'] !== this.req.headers['user-agent']) {
                    reject(Boom.unauthorized('Invalid token. User agent doesn\'t match').output);
                } else {
                    this.req.userId = payload.id;
                    resolve();
                }
            });
        }).then(() => {
            this.next();
        }).catch((err) => {
            this.errorHandler(err);
        });
    }
}

export function checkTokenMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const checkTokenMiddleware = new CheckTokenMiddleware();
    checkTokenMiddleware.setHandlerParams(req, res, next);
    checkTokenMiddleware.middleware();
}
