const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

module.exports.signup = (req, res, next) => {
    // Get validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    
    bcrypt.hash(password, 12)
        .then(hashedPas => {
            const user = new User({
                email: email,
                password: hashedPas,
                name: name
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'User created!',
                userId: result._id
            });
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        });
};