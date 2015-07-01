/*global require, module, applicationContext, Buffer */
'use strict';
var apiKey = applicationContext.configuration.apiKey;
var domain = applicationContext.configuration.domain;
var request = require('org/arangodb/request');
var multipartMime = require('./util/multipart-mime');
var util = require('util');

var data = require('./exports').schema.validate(applicationContext.argv[0]);
if (data.error) {
  throw data.error;
}

var payload = multipartMime(data.value);
var response = request.post('https://api.mailgun.net/v2/' + domain + '/messages', {
  body: payload.payload,
  headers: {
    'accept': 'application/json',
    'content-type': 'multipart/form-data; boundary=' + payload.boundary,
    'authorization': 'Basic ' + new Buffer('api:' + apiKey).toString('base64')
  }
});

if (response.body) {
  response.body = JSON.parse(response.body);
  if (Math.floor(response.statusCode / 100) !== 2) {
    throw new Error(util.format(
      'Server returned HTTP status %s with message: %s',
      response.statusCode,
      response.body.message
    ));
  }
} else if (Math.floor(response.statusCode / 100) !== 2) {
  throw new Error('Server sent an empty response with status ' + response.statusCode);
}

module.exports = response.body;
