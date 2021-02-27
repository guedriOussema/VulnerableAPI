const express = require('express');
const app = express();

require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in the mongoose models
const { Post, Comment } = require('./db/models');

// Load middleware
app.use(bodyParser.json());

// CORS MIDDLEWARE
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, HEAD, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, _id, x-access-token, x-refresh-token');

    res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');
    
    next();
})

/* ROUTE HANDLERS */

/* POST ROUTES */

/**
 * GET /posts
 * Purpose: Get all posts
 */
app.get('/posts', (req, res) =>{
    Post.find({}).then((posts) =>{
        res.send(posts);
    });
})

/**
 * POST /posts
 * Purpose: Create a post
 */
app.post('/posts', (req, res) =>{
    let title = req.body.title;
    let body = req.body.body

    let newPost = new Post({
        title,
        body
    });
    newPost.save().then((postDoc) => {
        res.send(postDoc);
    })
})
    


/**
 * PATCH /posts/:id
 * Purpose: Update a specified post
 */
app.patch('/posts/:id', (req, res) => {
    Post.findOneAndUpdate({ _id:req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
})

/**
 * DELETE /posts/:id
 * Purpose: Delete an existing post
 */
app.delete('/posts/:id', (req, res) => {
    Post.findOneAndRemove({ 
        _id: req.params.id
    }).then((removePostDoc) => {
        res.send(removePostDoc);
    })
})

/**
 * GET /posts/:postId
 * Purpose: Get a specific Post
 */
app.get('/posts/:postId', (req, res) => {
    Post.find({
        _id: req.params.postId
    }).then((post) => {
        res.send(post);
    })
});

/**
 * GET /posts/:postId/comments
 * Purpose: Get all comments in a specific Post
 */
app.get('/posts/:postId/comments', (req, res) => {
    Comment.find({
        _postId: req.params.postId
    }).then((comments) => {
        res.send(comments);
    })
});

/**
 * POST /posts/:postId/comments
 */
app.post('/posts/:postId/comments', (req, res) => {
    let newComment = new Comment({
        name: req.body.name,
        body:req.body.body,
        _postId: req.params.postId
    });
    newComment.save().then(() => {
        res.send(newComment);
    })
})



app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})