const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Post = require('../models/postModel');

exports.deleteOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id);
        console.log(doc)
        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }
        const post = await Post.find({
            id: req.params.id,
        });
        const userId = 0; //i don't know how to find it
        if (post.get("userId") != userId)
        {
            return next(new AppError(401, 'fail', 'permission denied.'), req, res, next);
        }
        const post = await Post.remove({
            id: req.params.id,
        });
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

exports.updateOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (Object.keys(req.body).length > 2)
        {
            return next(new AppError(400, 'fail', 'Request Length should be 2'), req, res, next);
        }
        if (!req.body.title)
        {
            return next(new AppError(400, 'fail', 'filed `title` is not valid'), req, res, next);
        }

        if (!doc) 
        {
            return next(new AppError(400, 'fail', 'url id is not valid'), req, res, next);
        }
        const post = await Post.find({
            id: req.params.id,
        });
        const userId = 0; //i don't know how to find it
        if (post.get("userId") != userId)
        {
            return next(new AppError(401, 'fail', 'permission denied.'), req, res, next);
        }
        res.status(204).json({
            status: 'success',
            data: {
                doc
            }
        });

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
        const doc = await Model.findById(req.params.id);
        console.log(doc)
        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
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

        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc
            }
        });

    } catch (error) {
        next(error);
    }
};