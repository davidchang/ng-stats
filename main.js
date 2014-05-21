var esprima = require('esprima');

var generateStats = exports.generateStats = function (inputCode) {

  var ast = esprima.parse(inputCode, {
    tolerant: true,
    comment: true,
    range: true,
    tokens: true
  });

  return inputCode;
};
