/*global require, module, applicationContext */
'use strict';
var map = require('underscore').map;
var crypto = require('crypto');
var NL = '\r\n';

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

module.exports = function (data) {
  var boundary = '--------------------' + crypto.genRandomAlphaNumbers(20);
  var payload = map(data, function (value, name) {
    if (!(value instanceof Array)) {
      value = [value];
    }
    return map(value, function (data) {
      return (name === "attachment" ? attachmentPart : textPart)(boundary, data, name);
    }).join(NL);
  }).filter(Boolean).join(NL) + NL + '--' + boundary + '--';
  return {payload: payload, boundary: boundary};
};