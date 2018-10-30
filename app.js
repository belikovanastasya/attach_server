const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
var cors = require('cors');
const session = require('express-session');

const user = require('./routes/user.route'); // Imports routes for the user
const app = express();
app.use(cors())

app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
// app.use((req, res, next) => {
//     if (req.cookies.user_sid && !req.session.user) {
//         res.clearCookie('user_sid');
//     }
//     next();
// });

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://attach:attach2018@ds161751.mlab.com:61751/attach';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { autoIndex: false, useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(passport.initialize());
require('./services/passport')(passport);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/users', user);



app.get('/', function(req, res) {
    res.send('hello');
});
let port = 3000;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});