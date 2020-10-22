"use strict";

import validator from "validator";
import moment from "moment";

const validateEmail = email => {
  return validator.isEmail(email);
};

const validatePhone = phone => {
  return validator.isMobilePhone(phone);
};

const validateInteger = num => {
  return validator.isInt(num.toString());
};

const strIsEmpty = str => {
  return validator.isEmpty(str);
};

const validateDate = date => {
  date = moment(date);
  return date.isValid();
};

export {
  validateEmail,
  validatePhone,
  validateInteger,
  strIsEmpty,
  validateDate
};
