// Third party libraries
const express = require('express');
const { body } = require('express-validator/check');

const router = express.Router();

// Export files
const feedController = require('../controllers/feedController');

router.get('/posts', feedController.getPosts);

/**
 * New post must has at least 5 charachter for title and content
 */
router.post(
    '/post',
    [
        body('title').trim().isLength({min: 5}),
        body('content').trim().isLength({min: 5})
    ],
    feedController.postPost
);

module.exports = router;
