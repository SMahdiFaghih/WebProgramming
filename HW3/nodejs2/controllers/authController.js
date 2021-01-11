const {
    promisify
} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');


const createToken = id => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.login = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length > 2)
        {
            return next(new AppError(400, 'fail', 'Request Length should be 2'), req, res, next);
        }
        const {
            email,
            password
        } = req.body;
        if (!email || !password) {
            return next(new AppError(404, 'fail', 'Please provide email or password'), req, res, next);
        }
        if (!validateEmail(email))
        {
            return next(new AppError(400, 'fail', 'filed `email` is not valid'), req, res, next);
        }
        const user = await User.findOne({
            email
        }).select('+password');
        if (!user || !await user.correctPassword(password, user.password)) {
            return next(new AppError(401, 'fail', 'wrong email or password.'), req, res, next);
        }
        const token = createToken(user.id);
        user.password = undefined;
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.signup = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length != 3)
        {
            return next(new AppError(400, 'fail', 'Request Length should be 3'), req, res, next);
        }
        if (!validateEmail(email))
        {
            return next(new AppError(400, 'fail', 'filed `email` is not valid'), req, res, next);
        }
        if (req.body.password.length < 5)
        {
            return next(new AppError(400, 'fail', 'filed `password`.length should be gt 5'), req, res, next);
        }
        const existedUser = await User.find({
            email: req.body.email,
        });
        if (existedUser != null)
        {
            return next(new AppError(409, 'fail', 'email already exist.'), req, res, next);
        }
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        const token = createToken(user.id);
        user.password = undefined;
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError(401, 'fail', 'You are not logged in! Please login in to continue'), req, res, next);
        }
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.id);
        if (!user) {
            return next(new AppError(401, 'fail', 'This user is no longer exist'), req, res, next);
        }
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

function validateEmail(email)
{
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}