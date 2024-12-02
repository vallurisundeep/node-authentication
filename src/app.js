const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:4200', // Angular app URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
    crossOriginResourcePolicy: false, // Allow cross-origin requests (CORS)
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger documentation route

// Routes

app.use('/api/v1', routes);

module.exports = app;

