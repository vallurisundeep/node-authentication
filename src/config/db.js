const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, 
process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: (msg) => logger.info(msg),
});

sequelize.authenticate()
.then(() => logger.info('Database connected successfully!'))
.catch(err => logger.error(`Database connection failed: ${err.message}`));

module.exports = sequelize;

