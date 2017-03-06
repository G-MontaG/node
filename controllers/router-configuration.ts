import express = require('express');

export interface RouterConfiguration {
    type: string;
    route: string;
    handler: HandlerFunction;
    middleware?: Array<MiddlewareFunction>;
}

export interface HandlerFunction {
    (req: express.Request, res: express.Response);
}

export interface MiddlewareFunction {
    (req: express.Request, res: express.Response, next: express.NextFunction);
}
