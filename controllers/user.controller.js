const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const validateRegisterInput = require('../validation/validation.register');
const validateLoginInput = require('../validation/validation.login');
const config = require('../services/config');
const User = require('../models/user.model');
const Works = require('../models/works.model');

const userController = {
  test(req, res) {
    const data = {
      "type": "training",
      "source_params": {
          "selected_sources": [
              {
                  "id": 8,
                  "name": "Quandl Eod",
                  "table_name": "source_quandl_eod",
                  "interpolation_method": "cubic",
                  "fields": [
                      "Adj_Open",
                      "Adj_High",
                      "Adj_Low",
                      "Adj_Close"
                  ],
                  "type": "daily"
              }
          ],
          "main_field": "Adj_Close",
          "main_source": 8,
          "split_rate": 0.3,
          "start_date": "2010-01-04",
          "end_date": "2019-04-08"
      },
      "feature_params": [
          {
              "handler_cls": "Interpolation",
              "args": {
                  "interpolate": {
                      "cubic": [
                          "Adj_Open",
                          "Adj_Close",
                          "Adj_Low",
                          "Adj_High"
                      ]
                  }
              }
          },
          {
              "handler_cls": "DateFeaturesGenerator",
              "args": {}
          },
          {
              "handler_cls": "Detrend",
              "args": {
                  "features": [
                      "Adj_Open",
                      "Adj_Close",
                      "Adj_Low",
                      "Adj_High",
                      "Adj_Volume"
                  ],
                  "target_apply": true
              }
          },
          {
              "handler_cls": "Scaler",
              "args": {
                  "target_apply": false
              }
          },
          {
              "handler_cls": "TargetEncoder",
              "args": {
                  "features": [
                      "dayofweek",
                      "weekofyear",
                      "is_month_start",
                      "is_month_end",
                      "is_weekend",
                      "is_quarter_start",
                      "is_quarter_end"
                  ],
                  "target": "Adj_Close"
              }
          },
          {
              "handler_cls": "LagTransformer",
              "args": {
                  "features_lags": {
                      "Adj_Open": [
                          1,
                          2,
                          15
                      ],
                      "Adj_Close": [
                          1,
                          2,
                          23,
                          27,
                          28,
                          29
                      ],
                      "Adj_High": [
                          1,
                          2,
                          29
                      ],
                      "Adj_Low": [
                          1,
                          2
                      ],
                      "Adj_Volume": [
                          1,
                          2,
                          23,
                          27,
                          29,
                          32
                      ],
                      "is_month_start": [
                          1
                      ],
                      "is_month_end": [
                          1
                      ],
                      "dayofyear": [
                          1
                      ],
                      "dayofweek": [
                          1
                      ],
                      "is_weekend": [
                          1,
                          2,
                          3
                      ],
                      "is_quarter_start": [
                          1
                      ],
                      "is_quarter_end": [
                          1
                      ],
                      "weekofyear": [
                          1
                      ]
                  }
              }
          },
          {
              "handler_cls": "Dropna",
              "args": {}
          }
      ],
      "target_params": {
          "detrending": false,
          "normalization": false
      },
      "model": "Gru",
      "hyper_params": {
          "recurrent_layers_count": 2,
          "recurrent_layers": [
              20,
              20
          ],
          "dense_layers_count": 2,
          "dense_layers": [
              20,
              20
          ],
          "epochs": "20",
          "recurrent_activation": "tanh",
          "dense_activation": "tanh",
          "learning_rate": "0.01",
          "recurrent_dropout": 0.01,
          "time_steps": 1,
          "learning_mode": {
              "type": "mini-batch",
              "size": 30
          },
          "optimizer": "adam",
          "batch_norm": false,
          "lr_decay_factor": 1.0,
          "lr_decay_step": 10,
          "recurrent_regularization_method": "l2",
          "recurrent_regularization_rate": 0,
          "recurrent_layer_dropout": 0.0,
          "dense_regularization_method": "l2",
          "dense_regularization_rate": 0,
          "dense_layer_dropout": 0.0,
          "namespaced": true
      },
      "date_source_fields": [
          "dayofweek",
          "is_weekend",
          "is_month_end"
      ],
      "company_id": 2
  }
    //res.send('Greetings from the Test controller!');
    res.json(data);
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
