const express = require('express');
const bodyParser = require('body-parser');

const user = require('./routes/user.route'); // Imports routes for the products
const app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://attach:attach2018@ds161751.mlab.com:61751/attach';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    // we're connected!
});

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/user', user);
// app.use(express.static(__dirname + '/templateLogReg'));

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     var err = new Error('File Not Found');
//     err.status = 404;
//     next(err);
// });

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});


let port = 1234;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});