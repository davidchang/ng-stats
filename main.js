var esprima = require('esprima'),
  estraverse = require('estraverse'),
  _ = require('underscore');

var generateStats = exports.generateStats = function (inputCode) {

  var ast = esprima.parse(inputCode, {
    tolerant: true,
    comment: true,
    range: true,
    tokens: true
  });

  var statsCollection = { };

  var statsToCollect = [
    'module',
    'controller',
    'directive',
    'value',
    'service',
    'factory',
    'filter'
  ];

  _.each(statsToCollect, function(stat) {
    statsCollection[stat] = [];
  });

  var angularVariables = ['angular'];

  var callIsOnAngular = function(node) {
    if (node.name) {
      return _.contains(angularVariables, node.name);
    }
    if (node.callee && node.callee.object) {
      return callIsOnAngular(node.callee.object);
    }
    return false;
  };

  var checkCallOnAngular = function(node) {
    if (node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        callIsOnAngular(node)) {
      var method = node.callee.property.name;
      var name = _.first(node.arguments).value;

      if (_.contains(statsToCollect, method)) {
        statsCollection[method].push(name);
      }
    }
  };

  var checkSettingOfAngularModule = function(node) {
    if (node.type === 'VariableDeclarator') {
      if (callIsOnAngular(node.init)) {
        angularVariables.push(node.id.name);
      }
    }
  };


  estraverse.traverse(ast, {
    enter: function(node, parent) {
      checkSettingOfAngularModule(node);
      checkCallOnAngular(node, parent);
    }
  });

  _.each(statsCollection, function(val, key) {
    statsCollection[key] = _.uniq(val);
  });

  return statsCollection;
};
