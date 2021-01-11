const mongoose = require('mongoose');
const User = require('./userModel');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please fill post title' ]
    },
    content: {
        type: String,
        required: [true, 'Please fill post content'],
    },
    userId:{
        type: String,
        required: [true, 'Post has no user'],
    }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;