'use strict';

let express = require('express');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let compress = require('compression');
// let cors = require('cors');
// let favicon = require('serve-favicon');
// let logger = require('morgan');
let port = process.env.PORT || 3001;
let hostname = process.env.HOST || "localhost";

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compress());
// app.use(logger('dev'));
// app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));

app.listen(port, hostname, () => {
    console.log('Express server listening on port ' + port);
});
