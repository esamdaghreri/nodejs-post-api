// Third party libraries
const { validationResult } = require('express-validator/check');

// Import models
const Post = require('../models/post');

module.exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First post',
        content: 'This is first post',
        imageUrl: 'images/esam.jpg',
        creator: {
            name: 'Esam Daghreri'
        },
        createdAt: new Date()
      },
    ]
  });
}

module.exports.postPost = (req, res, next) => {
  // Get input from body
  const title = req.body.title;
  const content = req.body.content;

  // Get validation errors
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: 'Validation failed, entered data is incorrect.',
        errors: errors.array()
      });
  }
  // Create new post
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/esam.jpg',
    creator: {
      name: 'Esam Daghreri'
    }
  });
  // Saving post
  post.save()
    .then(result => {
      res.status(201).json({
        message: 'Post has been created!',
        post: result
      });
    })
    .catch(error => {
      console.log(error);
    });
};