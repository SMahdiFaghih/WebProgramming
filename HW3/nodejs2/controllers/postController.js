const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Post = require('../models/postModel');
const base = require('./baseController');
const {
    promisify
} = require('util');
const jwt = require('jsonwebtoken');

exports.getAllPosts = async (req, res, next) => {
    try {
        const features = new APIFeatures(Post.find(), req.query)
            .sort()
            .paginate();
        const posts = await features.query;
        res.status(200).json({
            results: posts.length,
            posts: posts
        });
    } catch (error) {
        next(error);
    }
};

const id = 0;

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

        if (Object.keys(req.body).length !== 2)
        {
            return next(new AppError(400, 'fail', 'Request Length should be 2'), req, res, next);
        }
        if (!req.body.title)
        {
            return next(new AppError(400, 'fail', 'filed `title` is not valid'), req, res, next);
        }
        if (!req.body.content)
        {
            return next(new AppError(400, 'fail', 'filed `content` is not valid'), req, res, next);
        }
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            userId: decode.id,
        });
        res.status(201).json({
            id: post._id,
        });
    } catch (err) {
        next(err);
    }
};

exports.updatePost = base.updateOne(Post);
exports.deletePost = base.deleteOne(Post);
exports.getPostById = base.getOne(Post);