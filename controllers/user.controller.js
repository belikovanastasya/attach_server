const User = require('../models/user.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.user_create = function (req, res, next) {
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {
        let user = new User(
            {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                passwordConf: req.body.passwordConf,
            }
        );
        User.create(user, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.send(user);
            }
        });
    }
    else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
          if (error || !user) {
            var err = new Error('Wrong email or password.');
            err.status = 401;
            return next(err);
          } else {
            req.session.userId = user._id;
            return res.send(user);
          }
        });
      } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
      }
};
exports.user_auth = function (req, res, next) {
    console.log(req.email, req.password)
    if (req.body.email && req.body.password) {
        // let user = new User(
        //     {
        //         email: req.body.email,
        //         password: req.body.password,
        //     }
        // );
        User.authenticate(req.body.email, req.body.password, function (error, user) {
          if (error || !user) {
            var err = new Error('Wrong email or password.');
            err.status = 401;
            return next(err);
          } else {
            req.session.userId = user._id;
            return res.send(user);
          }
        });
      } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
      }
}

exports.user_details = function (req, res) {
  User.findById(req.params.id, function (err, user) {
      if (err) return next(err);
      res.send(user);
  })
};

exports.user_update = function (req, res) {
  User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, user) {
      if (err) return next(err);
      res.send('User udpated.');
  });
};

exports.user_delete = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err) {
      if (err) return next(err);
      res.send('Deleted successfully!');
  })
};