const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const user = require('./routes/user.route'); // Imports routes for the user
const app = express();

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://attach:attach2018@ds161751.mlab.com:61751/attach';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
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