'use strict';

// connection string format: 'mongodb://username:password@localhost:27017/test';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let connectionUrlParts: string[] = [];
let connectionUrl: string;

connectionUrlParts.push('mongodb://');
if (process.env.MONGO_USER && process.env.MONGO__PASSWORD) {
  connectionUrlParts.push(process.env.MONGO_USER + ':' + process.env.MONGO__PASSWORD + '@');
}
connectionUrlParts.push(process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB_NAME);
connectionUrl = connectionUrlParts.join('');

const connectionOptions = {
  server: {
    auto_reconnect: true,
    socketOptions: {keepAlive: 30000, connectTimeoutMS: 0, socketTimeoutMS: 0}
  }
};

function subscribeToMongoEvents(connection) {
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

subscribeToMongoEvents(mongoose.connection);
mongoose.connect(connectionUrl, connectionOptions);
