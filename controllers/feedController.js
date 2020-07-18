// Third party libraries
const { validationResult } = require('express-validator/check');

// node js library
const path = require('path');
const fs = require('fs');

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
  // Get validation errors
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  // Check if image uploaded
  if(!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  // Get input from body
  const imageUrl = req.file.path.replace("\\" ,"/");
  const title = req.body.title;
  const content = req.body.content;
  
  // Create new post
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
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

module.exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
    // Get validation errors
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if(req.file){
    imageUrl = req.file.path.replace("\\" ,"/");
  }

  if(!imageUrl){
    const error = new Error('Image not uploaded!');
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then(post => {
      if(!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
      }
      if(imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then(post => {
      res.status(200).json({message: 'Post updated!', post: post});
    })
    .catch(error => {
      if(!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    });
};

module.exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if(!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
      }

      // Check logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      res.status(200).json({message: 'Post deleted!'});
    })
    .catch(error => {
      console.log(error)
      if(!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, error => console.log(error));
};