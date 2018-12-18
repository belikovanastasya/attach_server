const Validator = require('validator');
const isEmpty = require('../services/isEmpty');

module.exports = function validateLoginInput(data) {
  let error = [];
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if(!Validator.isEmail(data.email)) {
      error.push('Email is invalid');
  }

  if(Validator.isEmpty(data.email)) {
      error.push('Email is required');
  }

  if(Validator.isEmpty(data.password)) {
    //   error.text = 'Password is required';
      error.push('Password is required');
  }
  return {
      error,
      isValid: isEmpty(error)
  }
}