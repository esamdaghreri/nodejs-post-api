const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

module.exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    let loadUser;
    User.findOne({email: email})
        .then(user => {
            if(!user) {
                const error = new Error('A user with this email could not found');
                error.statusCode = 401;
                throw error;
            }
            loadUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual =>{
            if(!isEqual) {
                const error = new Error('E-mail or password not correct');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                email: loadUser.email,
                userId: loadUser._id.toString()
                },
                'secretkeyfortoken',
                {
                    expiresIn: '1h'
                }
            );
            res.status(200).json({
                token: token,
                userId: loadUser._id.toString()
            });
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        });
};

module.exports.getStatus = (req, res, next) => {
    const userId = req.userId;
    User.findById(userId)
      .then(user => {
        if(!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200)
        .json({
          status: user.status
        });
      })
      .catch(error => {
        if(!error.statusCode){
          error.statusCode = 500;
        }
        next(error);
      });
  };

  module.exports.putStatus = (req, res, next) => {
    const userId = req.userId;
    const status = req.body.status;
    console.log(req.body)
    User.findById(userId)
      .then(user => {
        if(!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        user.status = status;
        return user.save();
      })
      .then(result => {
        res.status(200)
        .json({
          message: 'Status has been updated.',
        });
      })
      .catch(error => {
        if(!error.statusCode){
          error.statusCode = 500;
        }
        next(error);
      });
  };