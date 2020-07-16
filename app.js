// Third party libraries
const express = require('express');
const bodyParser = require('body-parser');

// Init app
const app = express();

// Parser to use json
app.use(bodyParser.json());
// Run the local server at port 8080
app.listen(8080);