const User = require('../models/userModel');
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

exports.getAllUsers = base.getAll(User);
exports.getUser = base.getOne(User);

// Don't update password on this 
exports.updateUser = base.updateOne(User);
exports.deleteUser = base.deleteOne(User);
