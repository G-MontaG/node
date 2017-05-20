import fs = require('fs');
import path = require('path');

import express = require('express');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import compress = require('compression');
import cors = require('cors');
import helmet = require('helmet');
import dotenv = require('dotenv');
dotenv.config({path: '.env'});

import multer = require('multer');
const upload = multer({dest: path.join(__dirname, 'uploads')});

import expressValidator = require('express-validator');

import './db';
import { apiRouter } from './controllers/api/api.router';
import { authRouter } from './controllers/auth/auth.router';

import swaggerJSDoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: {
        info: {
            title: 'Node Swagger API',
            version: '1.0.0',
            description: 'Demonstrating how to describe a RESTful API with Swagger',
        },
        host: 'localhost:3000',
        basePath: '/',
    },
    apis: ['./controllers/**/*.ts'],
});
fs.writeFile('./swagger/public/swagger.json', JSON.stringify(swaggerSpec), (err) => {
    if (err) {
        throw err;
    }
});

const publicDir = path.join(__dirname, 'public');

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
        this.app.use(cors());
        this.app.use(helmet());

        this.app.use(express.static(publicDir));

        this.configureRoutes();
        this.configureErrorHandler();

        this.app.listen(this.app.get('port'), () => {
            console.log(`Server listening on port ${this.app.get('port')} in ${this.app.get('env')} mode`);
        });
    }

    private addNamespace(namespace: string, router) {
        this.app.use(namespace, router);
    }

    private configureRoutes() {
        this.addNamespace('/auth', authRouter.routes);
        this.addNamespace('/api', apiRouter.routes);
    }

    private configureErrorHandler() {
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err.stack);
            res.status(err.status || 500).send({
                message: err.message || err.name,
                error: err.toString()
            });
        });
    }
}

const server = new Server();
