// Third party libraries
const express = require('express');
const bodyParser = require('body-parser');

// Export files
const feedRoutes = require('./routes/feed');

// Init app
const app = express();

// Parser to use json
app.use(bodyParser.json());
// Routers
app.use('/feed', feedRoutes);

// Run the local server at port 8080
app.listen(8080);