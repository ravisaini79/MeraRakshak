const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const m2s = require('mongoose-to-swagger');

// Import all models
const CallLog = require('../models/CallLog');
const Contact = require('../models/Contact');
const Device = require('../models/Device');
const FamilyGroup = require('../models/FamilyGroup');
const LocationHistory = require('../models/LocationHistory');
const MessageUser = require('../models/MessageUser');
const RecoveredMessage = require('../models/RecoveredMessage');
const SecurityEvent = require('../models/SecurityEvent');
const User = require('../models/User');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TrackShield API',
      version: '1.0.0',
      description: 'API documentation for TrackShield Platform',
    },
    servers: [
      {
        url: 'https://merarakshak.onrender.com',
        description: 'Production server (Live URL)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        CallLog: m2s(CallLog),
        Contact: m2s(Contact),
        Device: m2s(Device),
        FamilyGroup: m2s(FamilyGroup),
        LocationHistory: m2s(LocationHistory),
        MessageUser: m2s(MessageUser),
        RecoveredMessage: m2s(RecoveredMessage),
        SecurityEvent: m2s(SecurityEvent),
        User: m2s(User),
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
};

module.exports = setupSwagger;
