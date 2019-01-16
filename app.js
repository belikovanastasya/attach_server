const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');
const user = require('./routes/user.route'); // Imports routes for the user

const app = express();
app.use(cors());

// Set up mongoose connection
const devDbUrl = 'mongodb://attach:attach2018@ds161751.mlab.com:61751/attach';
const mongoDB = process.env.MONGODB_URI || devDbUrl;
mongoose.connect(mongoDB, { autoIndex: false, useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(passport.initialize());
require('./services/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/users', user);
app.get('/', function(req, res) {
    res.send('hello');
});
const port = 3000;

app.listen(port, () => {
  console.log(`Server is up and running on port number ${port}`);
});
