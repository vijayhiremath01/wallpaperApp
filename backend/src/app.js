// Import section
const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');

// Middleware
app.use(express.json());
app.use(cors());
app.use(compression());

// Routes
const wallpaperRoute = require('./routes/walpaper.route');
app.use('/api/wallpapers', wallpaperRoute);

module.exports = app;
