const dotenv =require('dotenv');
dotenv.config(); // loads the .env file from the project root

const DEBUG = process.env.NODE_ENV === 'development';
const DEV = DEBUG || process.env.DEPLOYMENT_NAME === 'dev';

const debugConfig = {
  deploymentName: 'dev',
  mongoUri: "mongodb://localhost:27017/cs-api",
};

const config = {
  DEBUG, DEV,

  deploymentName: process.env.DEPLOYMENT_NAME,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  credentials: require('./credentials'),

  passwordRecoveryExpiration: 1 * 24 * 60 * 60 * 1000, // 1 day in ms

  ...(DEBUG && debugConfig),
}

module.exports = config;
