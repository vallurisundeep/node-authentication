const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./routes');
 
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger documentation route

// Routes

app.use('/api/v1', routes);

module.exports = app;

