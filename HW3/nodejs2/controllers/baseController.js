const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Post = require('../models/postModel');
const {
    promisify
} = require('util');
const jwt = require('jsonwebtoken');

exports.deleteOne = Model => async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError(500, 'fail', 'User not found'), req, res, next);
        }
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const doc_temp = await Model.findById(req.params.id).catch(error=>{});
        if (!doc_temp) {
            return next(new AppError(404, 'fail', 'url id is not valid'), req, res, next);
        }
        if (String(doc_temp.userId) !== String(decode.id))
        {
            return next(new AppError(401, 'fail', 'permission denied.'), req, res, next);
        }
        const doc = await Model.findByIdAndDelete(req.params.id).catch(error=>{});
        res.status(204).json();
    } catch (error) {
        next(error);
    }
};

exports.updateOne = Model => async (req, res, next) => {
    try {
        if (Object.keys(req.body).length !== 2)
        {
            return next(new AppError(400, 'fail', 'Request Length should be 2'), req, res, next);
        }
        if (!req.body.title)
        {
            return next(new AppError(400, 'fail', 'field `title` is not valid'), req, res, next);
        }
        if (!req.body.content)
        {
            return next(new AppError(400, 'fail', 'field `content` is not valid'), req, res, next);
        }
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).catch(error=>{});
        if (!doc) 
        {
            return next(new AppError(400, 'fail', 'url id is not valid'), req, res, next);
        }
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError(500, 'fail', 'User not found'), req, res, next);
        }
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        if (String(doc.userId) !== String(decode.id))
        {
            return next(new AppError(401, 'fail', 'permission denied.'), req, res, next);
        }
        res.status(204).json();

    } catch (error) {
        next(error);
    }
};

exports.createOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                doc
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.getOne = Model => async (req, res, next) => {
    try {
        const post = await Model.findById(req.params.id).catch(error=>{});;
        if (!post) {
            return next(new AppError(400, 'fail', 'url id is not valid'), req, res, next);
        }
        res.status(200).json({
            post
        });
    } catch (error) {
        next(error);
    }
};

exports.getAll = Model => async (req, res, next) => {
    try {
        const features = new APIFeatures(Model.find(), req.query)
            .sort()
            .paginate();
        const posts = await features.query;
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError(500, 'fail', 'User not found'), req, res, next);
        }
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const postsByUser = posts.filter(p=>p.userId === decode.id);
        res.status(200).json({
            results: postsByUser.length,
            posts: postsByUser
        });

    } catch (error) {
        next(error);
    }
};