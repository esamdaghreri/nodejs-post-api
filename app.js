// node js library
const path = require('path');

// Third party libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Import files
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

// Init app
const app = express();

// Setting the file storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  }
});
// Filter the images that only accept: png, jpg and jpeg
const fileFilter = (req, file, cb) => {
  if(
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Parser to use json
app.use(bodyParser.json());
// Register multer to parse any coming request
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image')); // image => is tha name if input filed

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
app.use('/auth', authRoutes);

// Route for handle error
app.use((error, req, res, next) => {
  const status = error.statusCode || 500; // if error.statusCode undefined, use 500 as a default
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data
  });
});

// Connect to database
mongoose.connect('mongodb+srv://esam:8rlWMHFR2cDt5mbi@cluster0.v1w8k.mongodb.net/messages')
  .then(result => {
    // Run the local server at port 8080
    app.listen(8080);
  })
  .catch(error => {
    console.log(error);
  });