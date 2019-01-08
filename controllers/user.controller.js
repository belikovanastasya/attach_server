const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')
const validateRegisterInput = require('../validation/validation.register');
const validateLoginInput = require('../validation/validation.login');
const config = require('../services/config');
const User = require('../models/user.model');

const userController = {
  test(req, res) {
    res.send('Greetings from the Test controller!')
  },
  user_create(req, res) {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne({
      email: req.body.email,
    }).then((user) => {
      let errors = {};
      if (user) {
        errors.text = 'Email already exists';
        return res.status(400).json({ error: errors });
      }
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        firstName: '',
        lastName: '',
        avatar: '',
        isDesigner: false,
        description: '',
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) { console.error('There was an error', err) }
        else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.error('There was an error', err)
            else {
              newUser.password = hash;
              newUser.save().then((user) => {
                res.json(user);
              });
            }
          })
        }
      });
    });
  },
  user_login(req, res) {
    const { error, isValid } = validateLoginInput(req.body);
    const errors = {};
    if (!isValid) {
      errors.text = error.join(', ');
      return res.status(400).json({ error: errors });
    }
    const { email, password } = req.body;

    User.findOne({ email }).then((user) => {
      if (!user) {
        errors.text = 'User not found';
        return res.status(404).json({ error: errors });
      }
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
          };
          jwt.sign(
            payload,
            config.jwtSecret,
            {
              expiresIn: 3600
            },
            (err, token) => {
              if (err) console.error('There is some error in token', err);
              else {
                res.json({
                  success: true,
                  token: `Bearer ${token}`,
                  user,
                });
              }
            }
          );
        } else {
          errors.text = 'Incorrect Password';
          return res.status(400).json({ error: errors });
        }
      });
    });
  },
  user_check(req, res) {
    const user = jwtDecode(req.body.token);
    const userID = user.id;
    User.findOne({ _id: userID }).then((user) => {
      if (!user) {
        return res.status(404);
      }
      return res.status(200).json({ user });
    });
  }
};


module.exports = userController;

// exports.test = function (req, res) {
//   res.send('Greetings from the Test controller!');
// };

// exports.user_create = function(req, res) {
//   const { errors, isValid } = validateRegisterInput(req.body);

//   if (!isValid) {
//     return res.status(400).json(errors);
//   }
//   User.findOne({
//     email: req.body.email
//   }).then(user => {
//     let errors = {};
//     if (user) {
//       errors.text = "Email already exists";
//       return res.status(400).json({ error: errors });
//     } else {
//       const newUser = new User({
//         email: req.body.email,
//         password: req.body.password,
//         firstName: "",
//         lastName: "",
//         avatar: "",
//         isDesigner: false,
//         description: ""
//       });

//       bcrypt.genSalt(10, (err, salt) => {
//         if (err) console.error("There was an error", err);
//         else {
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) console.error("There was an error", err);
//             else {
//               newUser.password = hash;
//               newUser.save().then(user => {
//                 res.json(user);
//               });
//             }
//           });
//         }
//       });
//     }
//   });
// };

// exports.user_login = function(req, res) {
//   const { error, isValid } = validateLoginInput(req.body);
//   let errors = {};
//   if (!isValid) {
//     errors.text = error.join(", ");
//     return res.status(400).json({ error: errors });
//   }

//   const email = req.body.email;
//   const password = req.body.password;

//   User.findOne({ email }).then(user => {
//     if (!user) {
//       errors.text = "User not found";
//       return res.status(404).json({ error: errors });
//     }
//     bcrypt.compare(password, user.password).then(isMatch => {
//       if (isMatch) {
//         const payload = {
//           id: user.id,
//           name: user.name
//         };
//         jwt.sign(
//           payload,
//           config.jwtSecret,
//           {
//             expiresIn: 3600
//           },
//           (err, token) => {
//             if (err) console.error("There is some error in token", err);
//             else {
//               res.json({
//                 success: true,
//                 token: `Bearer ${token}`,
//                 user: user
//               });
//             }
//           }
//         );
//       } else {
//         errors.text = "Incorrect Password";
//         return res.status(400).json({ error: errors });
//       }
//     });
//   });
// };
// exports.user_check = function(req, res) {
//   const user = jwtDecode(req.body.token);
//   const user_ID = user.id;
//   User.findOne({ _id: user_ID }).then(user => {
//     if (!user) {
//       return res.status(404);
//     }
//     return res.status(200).json({ user: user });
//   });
// };
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
