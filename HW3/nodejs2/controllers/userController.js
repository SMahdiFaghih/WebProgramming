const {
    promisify
} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const base = require('./baseController');

exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            active: false
        });

        res.status(204).json({
            status: 'success',
            data: null
        });


    } catch (error) {
        next(error);
    }
};

exports.error = (req, res, next) => {
    return next(new AppError(405, 'fail', 'Only `Post` Method is Valid'), req, res, next);
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).catch(error=>{});;
        if (!user) {
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
        if (String(user._id)!== String(decode.id))
        {
            return next(new AppError(401, 'fail', 'permission denied.'), req, res, next);
        }
        res.status(200).json({
            user
        });
    } catch (error) {
        next(error);
    }
};

// Don't update password on this 
exports.updateUser = base.updateOne(User);
exports.deleteUser = base.deleteOne(User);
