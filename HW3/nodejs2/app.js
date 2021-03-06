const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const publicRoutes = require('./routes/publicRoutes');
const userRoutes = require('./routes/userRoutes');
const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const app = express();

app.use(cors());
app.use(helmet());
const limiter = rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('', limiter);
app.use(express.json({
    limit: '15kb'
}));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use('', publicRoutes);
app.use('/admin', userRoutes);
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});
app.use(globalErrHandler);
module.exports = app;