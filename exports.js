/*global require, module, applicationContext */
'use strict';
var joi = require('joi');

module.exports = {
  mount: applicationContext.mount,
  name: 'mailer',
  schema: joi.object().required(),
  maxFailures: applicationContext.configuration.maxFailures
};
