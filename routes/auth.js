// Third party libraries
const express = require('express');
const { body } = require('express-validator/check');
const bcrypt = require('bcryptjs');

// Import files
const User = require('../models/user');
const authController = require('../controllers/authController');

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

module.exports = router;