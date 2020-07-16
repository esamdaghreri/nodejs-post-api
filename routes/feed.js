// Third party libraries
const express = require('express');

const router = express.Router();

// Export files
const feedController = require('../controllers/feedController');

router.get('/posts', feedController.getPosts);
module.exports = router;
