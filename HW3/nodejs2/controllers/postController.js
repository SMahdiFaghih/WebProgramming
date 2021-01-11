const Post = require('../models/postModel');
const User = require('../models/userModel');
const base = require('./baseController');
const {
    promisify
} = require('util');
const jwt = require('jsonwebtoken');

exports.getAllPosts = base.getAll(Post);

exports.createPost = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError(500, 'fail', 'User not found'), req, res, next);
        }
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            userId: decode.id,
        });
        res.status(201).json({
            status: 'success',
            token,
            data: {
                post
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updatePost = base.updateOne(Post);
exports.deletePost = base.deleteOne(Post);
exports.getPostById = base.getOne(Post);
exports.getAllPosts = base.getAll(Post);