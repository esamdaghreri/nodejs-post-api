// node js library
const path = require('path');

// Third party libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import files
const feedRoutes = require('./routes/feed');

// Init app
const app = express();

// Parser to use json
app.use(bodyParser.json());

// Serve any request for images folder statically by making a static path
app.use('/images', express.static(path.join(__dirname, 'images')));

// Add some header in response for CORS allow any clients to use our api
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'),
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'),
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
  next();
});

// Routers
app.use('/feed', feedRoutes);

// Connect to database
mongoose.connect('')
  .then(result => {
    // Run the local server at port 8080
    app.listen(8080);
  })
  .catch(error => {
    console.log(error);
  });