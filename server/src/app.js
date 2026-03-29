const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const locationRoutes = require('./routes/locationRoutes');
const familyRoutes = require('./routes/familyRoutes');
const securityRoutes = require('./routes/securityRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Advanced Tracking routes
const callLogRoutes = require('./routes/callLogRoutes');
const callUserRoutes = require('./routes/callUserRoutes');
const advancedSecurityRoutes = require('./routes/newSecurityRoutes');
const messageUserRoutes = require('./routes/messageUserRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/admin', adminRoutes);

// Advanced Tracking API Mounts
app.use('/api/call-logs', callLogRoutes);
app.use('/api/call-users', callUserRoutes);
app.use('/api/security-events', advancedSecurityRoutes);
app.use('/api/message-users', messageUserRoutes);
app.use('/api/messages', messageRoutes);

// Setup Swagger
const setupSwagger = require('./config/swagger');
setupSwagger(app);

// Error Handling
app.use(errorHandler);

module.exports = app;
