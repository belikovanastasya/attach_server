const Validator = require('validator');
const isEmpty = require('../services/isEmpty');

module.exports = function validateLoginInput(data) {
  let error = {};
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if(!Validator.isEmail(data.email)) {
      error.email = 'Email is invalid';
  }

  if(Validator.isEmpty(data.email)) {
      error.email = 'Email is required';
  }

  if(!Validator.isLength(data.password, {min: 6, max: 30})) {
      error.password = 'Password must have 6 chars';
  }

  if(Validator.isEmpty(data.password)) {
      error.password = 'Password is required';
  }
  return {
      error,
      isValid: isEmpty(error)
  }
}