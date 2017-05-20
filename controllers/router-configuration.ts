import express = require('express');

export interface RouterConfiguration {
    type: string;
    route: string;
    handler: HandlerFunction;
    middleware?: MiddlewareFunction[];
}

export interface HandlerFunction {
    (req: express.Request, res: express.Response, next: express.NextFunction);
}

export interface MiddlewareFunction {
    (req: express.Request, res: express.Response, next: express.NextFunction);
}
