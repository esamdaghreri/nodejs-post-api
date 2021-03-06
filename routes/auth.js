// Third party libraries
const express = require('express');
const { body } = require('express-validator/check');
const bcrypt = require('bcryptjs');

// Import files
const User = require('../models/user');
const authController = require('../controllers/authController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please eneter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({email: value})
                    .then(userDoc => {
                        if(userDoc) {
                            return Promise.reject('E-mail already exists!');
                        }
                    });
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({min: 5}),
        body('name')
            .trim()
            .not()
            .isEmpty()    
    
    ],
    authController.signup
);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getStatus);

router.put('/status', isAuth, 
    [
        body('status')
        .trim()
        .not()
        .isEmpty() 
    ], 
    authController.putStatus
);

module.exports = router;