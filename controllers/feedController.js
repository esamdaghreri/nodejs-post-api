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