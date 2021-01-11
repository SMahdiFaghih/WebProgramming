const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});

process.on('uncaughtException', err => {
    console.log('uncaught exception')
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');
const database = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    console.log('DB connected Successfully!');
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('unhandled rejection')
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});