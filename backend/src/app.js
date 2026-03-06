// Import section
const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const wallpaperRoute = require('./routes/walpaper.route');
app.use('/api/wallpapers', wallpaperRoute);

module.exports = app;