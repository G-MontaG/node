import fs = require('fs');
import path = require('path');

import express = require('express');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import compress = require('compression');
import helmet = require('helmet');
import dotenv = require('dotenv');
import multer = require('multer');
import expressValidator = require('express-validator');
const upload = multer({dest: path.join(__dirname, 'uploads')});

dotenv.config({path: '.env'});

import './db';

const publicDir = path.join(__dirname, '../frontend/public');

import {ServerMessage} from './helpers/serverMessage';

class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.app.set('port', process.env.SERVER_PORT || 3000);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(cookieParser());
        // this.app.use(expressValidator());
        this.app.use(compress(6));
        this.app.use(helmet());

        this.app.use(express.static(publicDir));

        this.configureRoutes();
        this.configureErrorHandler();

        this.app.listen(this.app.get('port'), function () {
            console.log(`Server listening on port ${this.app.get('port')} in ${this.app.get('env')} mode`);
        }.bind(this));
    }

    addNamespace(namespace: string, router) {
        this.app.use(namespace, router);
    }

    configureRoutes() {
        // this.addNamespace('/auth', authRouter);
        // this.addNamespace('/api', apiRouter);
    }

    configureErrorHandler() {
        this.addNamespace('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (req.accepts('html')) {
                res.sendFile('error.html', {root: publicDir});
            } else if (req.accepts('json')) {
                ServerMessage.error(req, res, 404, 'Page not found');
            }
        });
    }
}

new Server();
