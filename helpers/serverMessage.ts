import express = require('express');
import winston = require('winston');

export class ServerMessage {
  constructor() {

  }

  public static error(req: any, res: express.Response, status: number, message: string) {
    let _status = status || 500;
    let _message = message || '';
    let err = {
      status: _status,
      message: _message,
      error: new Error(_message)
    };

    res.status(_status);
    res.send(err);
    winston.log('error', `${req.method} ${req.path} [${err.status}] - ${err.message}`);
  };

  public static message(res: express.Response, status: number, data: any) {
    let _status = status || 200;
    let _data = data || {};
    let _message = _data.message || '';
    let _params = _data.params;
    let _token = _data.token;
    let _flag = _data.flag;

    res.status(_status);
    res.send({
      message: _message,
      params: _params,
      token: _token,
      flag: _flag
    });
  };

  public static data(res: express.Response, status: number, data: any) {
    let _status = status || 200;
    let _data = data || {};
    res.status(_status);
    res.send(_data);
  };
}