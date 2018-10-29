const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../validation/validation.register');
const validateLoginInput = require('../validation/validation.login');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!')
};

exports.user_create = function(req, res) {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        error: "Email already exists"
      });

    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.error("There was an error", err);
        else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.error("There was an error", err);
            else {
              newUser.password = hash;
              newUser.save().then(user => {
                res.json(user);
              });
            }
          });
        }
      });
    }
  });
};

exports.user_login = function (req, res) {
    const { error, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json({error: error});
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                error.email = 'User not found'
                return res.status(404).json(error);
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            name: user.name
                        }
                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            if (err) console.error('There is some error in token', err);
                            else {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        });
                    }
                    else {
                        error.password = 'Incorrect Password';
                        return res.status(400).json(error);
                    }
                });
        });
}
exports.user_check = function (req, res) {
    return res.json({
        id: req.user.id,
        email: req.user.email
    });
}
// exports.user_details = function (req, res) {
//   User.findById(req.params.id, function (err, user) {
//       if (err) return next(err);
//       res.send(user);
//   })
// };

// exports.user_update = function (req, res) {
//   User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, user) {
//       if (err) return next(err);
//       res.send('User udpated.');
//   });
// };

// exports.user_delete = function (req, res) {
//   User.findByIdAndRemove(req.params.id, function (err) {
//       if (err) return next(err);
//       res.send('Deleted successfully!');
//   })
// };