/*jshint indent: 2, nomen: true, maxlen: 120 */
/*global require, exports, applicationContext */
var _ = require('underscore'),
  queues = require('org/arangodb/foxx').queues,
  internal = require('internal'),
  NL = '\r\n';

function attachmentPart(boundary, attachment, name) {
  return _mimePart(boundary, attachment.content, [
    'Content-Disposition: form-data; name="' + name + '"; filename="' + attachment.name + '"',
    'Content-Type: ' + (attachment.type || 'application/octet-stream'),
    'Content-Transfer-Encoding: base64'
  ]);
}

function textPart(boundary, content, name) {
  return _mimePart(boundary, content, [
    'Content-Disposition: form-data; name="' + name + '"'
  ]);
}

function _mimePart(boundary, content, headers) {
  return '--' + boundary + NL +
  headers.join(NL) + NL +
  NL + content;
}

queues.registerJobType(applicationContext.configuration.jobType, {
  maxFailures: applicationContext.configuration.maxFailures,
  execute: function (data) {
    'use strict';
    var boundary = '--------------------' + internal.genRandomAlphaNumbers(20),
      payload,
      response,
      body;

    payload = _.map(data, function (value, name) {
      if (!(value instanceof Array)) {
        value = [value];
      }
      return _.map(value, function (data) {
        return (name === "attachment" ? attachmentPart : textPart)(boundary, data, name);
      }).join(NL);
    }).filter(Boolean).join(NL) + NL +
    '--' + boundary + '--';

    response = internal.download(
      'https://api.mailgun.net/v2/' + applicationContext.configuration.domain + '/messages',
      payload,
      {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'multipart/form-data; boundary=' + boundary,
          'authorization': 'Basic ' + internal.base64Encode('api:' + applicationContext.configuration.apiKey)
        }
      }
    );
    if (response.body) {
      body = JSON.parse(response.body);
      if (Math.floor(response.code / 100) !== 2) {
        throw new Error(
          'Server returned HTTP status ' +
          response.code +
          ' with message: ' +
          body.message
        );
      }
    } else if (Math.floor(response.code / 100) !== 2) {
      throw new Error('Server sent an empty response with status ' + response.code);
    }
  }
});

Object.defineProperty(exports, 'jobType', {
  get: function () {
    'use strict';
    return applicationContext.configuration.jobType;
  },
  configurable: false,
  enumerable: true
});