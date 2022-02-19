const winston = require('winston');
const dataDir = require('./data-dir');

const env = process.env.NODE_ENV || 'development';

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: dataDir + '/debug.log'})
    ],
    exceptionHandlers: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: dataDir + '/exceptions.log'})
    ],
    exitOnError: false
  });

module.exports = logger;