const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const validateRegisterInput = require('../validation/validation.register');
const validateLoginInput = require('../validation/validation.login');
const config = require('../services/config');
const User = require('../models/user.model');
const Works = require('../models/works.model');
const Projects = require('../models/project.model');

const userController = {
  test(req, res) {
    res.send('Greetings from the Test controller!');
  },
  user_create(req, res) {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne({
      email: req.body.email,
    }).then((user) => {
      const errors = {};
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
        if (err) {
          console.error('There was an error', err)
        } else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.error('There was an error', err);
            else {
              newUser.password = hash;
              newUser.save().then((user) => {
                res.json(user);
              });
            }
          });
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
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            const payload = {
              id: user.id,
              name: user.name,
            }
            jwt.sign(
              payload,
              config.jwtSecret,
              {
                expiresIn: 3600,
              },
              (err, token) => {
                if (err) console.error('There is some error in token', err)
                else {
                  res.json({
                    success: true,
                    token: `Bearer ${token}`,
                    user,
                  });
                }
              });
          } else {
            errors.text = 'Incorrect Password';
            return res.status(400).json({ error: errors });
          }
        })
        .catch(err => console.log(err));
    })
  },
  user_check(req, res) {
    if (req.body.token === null || req.body.token === undefined) {
      return res.status(403).json({
        error: 'User is not authenticated',
      });
    }
    const user = jwtDecode(req.body.token)
    const userID = user.id;
    User.findOne({ _id: userID }).then((user) => {
      if (!user) {
        return res.status(404);
      }
      return res.status(200).json({ user });
    })
  },
  user_update(req, res) {
    User.findOneAndUpdate(req.email, req.body, (err, user) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json({ user });
    })
  },

  user_works(req, res) {
    const { email } = req.body;
    Works.aggregate([
      {
        $match: {
          author: email,
        },
      },
    ]).then(works => res.status(200).json({ works }));
  },
};
module.exports = userController;
