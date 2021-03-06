const Validator = require('validator');
const isEmpty = require('../services/isEmpty');

module.exports = function validateRegisterInput(data) {
  const error = {};
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : '';
  if (!Validator.isEmail(data.email)) {
    error.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    error.email = 'Email is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    error.password = 'Password must have 6 chars';
  }

  if (Validator.isEmpty(data.password)) {
    error.password = 'Password is required';
  }

  if (!Validator.isLength(data.password_confirm, { min: 6, max: 30 })) {
    error.password_confirm = 'Password must have 6 chars';
  }

  if (!Validator.equals(data.password, data.password_confirm)) {
    error.password_confirm = 'Password and Confirm Password must match';
  }

  if (Validator.isEmpty(data.password_confirm)) {
    error.password_confirm = 'Password is required';
  }

  return {
    error,
    isValid: isEmpty(error),
  };
};
