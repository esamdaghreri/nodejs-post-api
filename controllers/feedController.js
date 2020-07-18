// Third party libraries
const { validationResult } = require('express-validator/check');

// Import models
const Post = require('../models/post');

module.exports.getPosts = (req, res, next) => {
  const posts = Post.find().
    then(posts => {
      res.status(200).json({
        message: 'Fetching posts successfully.',
        posts: posts
      });
    }).catch(error => {
      if(!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    });
};

module.exports.postPost = (req, res, next) => {
  // Get input from body
  const title = req.body.title;
  const content = req.body.content;

  // Get validation errors
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
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
      if(!error.statusCode){
        error.statusCode = 500;
      }
      next(error); // In promise, throw error will not work. You have to use next function to reach to next handle middleware.
    });
};

module.exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if(!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
      }
      res.status(200)
        .json({
          message: 'Post fetched.',
          post: post
        });
    })
    .catch(error => {
      if(!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    });
};