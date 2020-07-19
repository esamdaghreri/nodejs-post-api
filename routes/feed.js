// Third party libraries
const express = require('express');
const { body } = require('express-validator/check');

const router = express.Router();

// Import files
const feedController = require('../controllers/feedController');
const isAuth = require('../middleware/is-auth');

router.get('/posts', isAuth, feedController.getPosts);

/**
 * New post must has at least 5 charachter for title and content
 */
router.post(
    '/post',
    isAuth,
    [
        body('title').trim().isLength({min: 5}),
        body('content').trim().isLength({min: 5})
    ],
    feedController.postPost
);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put(
    '/post/:postId',
    isAuth,
    [
        body('title').trim().isLength({min: 5}),
        body('content').trim().isLength({min: 5})
    ],
    feedController.updatePost
);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
