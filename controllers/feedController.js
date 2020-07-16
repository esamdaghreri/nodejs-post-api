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
