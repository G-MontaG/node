'use strict';

// connection string format: 'mongodb://username:password@localhost:27017/test';
import mongoose = require('mongoose');
mongoose.Promise = global.Promise;

class MongodbConnection {
    private connectionUrlParts: string[] = [];
    private connectionUrl: string;

    private readonly connectionOptions = {
        server: {
            auto_reconnect: true,
            socketOptions: {keepAlive: 30000, connectTimeoutMS: 0, socketTimeoutMS: 0}
        }
    };

    constructor() {
        this.connectionUrlParts.push('mongodb://');
        if (process.env.MONGO_USER && process.env.MONGO__PASSWORD) {
            this.connectionUrlParts.push(process.env.MONGO_USER + ':' +
                process.env.MONGO__PASSWORD + '@');
        }
        this.connectionUrlParts.push(process.env.MONGO_HOST + ':' +
            process.env.MONGO_PORT + '/' +
            process.env.MONGO_DB_NAME);
        this.connectionUrl = this.connectionUrlParts.join('');

        this.subscribeToMongoEvents(mongoose.connection);
        mongoose.connect(this.connectionUrl, this.connectionOptions);
    }

    private subscribeToMongoEvents(connection) {
        connection.on('connected', () => {
            console.log('Mongoose connected');
        });
        connection.on('open', () => {
            console.log('Mongoose connection opened');
        });
        connection.on('disconnecting', () => {
            console.log('Mongoose disconnecting');
        });
        connection.on('db: disconnected', () => {
            console.log('Mongoose disconnected');
        });
        connection.on('close', () => {
            console.log('Mongoose connection closed');
        });
        connection.on('reconnected', () => {
            console.log('Mongoose reconnected');
        });
        connection.on('error', (error) => {
            console.error(error.message);
        });
    }
}

export const mongodbConnection = new MongodbConnection();
