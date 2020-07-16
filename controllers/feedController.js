// Third party libraries
const { validationResult } = require('express-validator/check');

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
    // Saving to database
    res.status(201).json({
        message: 'Post has been created!',
        post: {
            _id: '26512651',
            title: title,
            content: content,
            creator: {
                name: 'Esam Daghreri'
            },
            createdAt: new Date()
        }
    });
}