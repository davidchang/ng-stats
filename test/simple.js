var assert = require('should');

// so we don't have to put the stuff we're testing into a string
var stringifyFunctionBody = require('./utils').stringifyFunctionBody;
var generateStats = function (arg) {
  return require('../main').generateStats(
    stringifyFunctionBody(arg));
};


describe('generateStats', function () {

  it('should return an object', function() {
    var stats = generateStats(function () {});
    stats.should.be.an.object;
  });

  describe('when they are declared independently', function() {
    it('should count a module', function() {
      var stats = generateStats(function () {
        angular.module('david', []);
      });
      stats.module.should.eql(['david']);
    });

    it('should only count one module when it\'s the same', function() {
      var stats = generateStats(function () {
        angular.module('david', []);
        angular.module('david', []);
      });
      stats.module.should.eql(['david']);
    });

    it('should count a controller', function() {
      var stats = generateStats(function () {
        angular.controller('david', function() {});
      });
      stats.controller.should.eql(['david']);
    });

    it('should count a value', function() {
      var stats = generateStats(function () {
        angular.value('david', 3);
      });
      stats.value.should.eql(['david']);
    });

    it('should count a service', function() {
      var stats = generateStats(function () {
        angular.service('david', function() {});
      });
      stats.service.should.eql(['david']);
    });

    it('should count a filter', function() {
      var stats = generateStats(function () {
        angular.filter('david', function() {});
      });
      stats.filter.should.eql(['david']);
    });

    it('should count a provider', function() {
      var stats = generateStats(function () {
        angular.provider('david', function() {});
      });
      stats.provider.should.eql(['david']);
    });
  });

  describe('when they are chained', function() {
    it('should count one module, controller, and value', function() {
      var stats = generateStats(function () {
        angular.module('david', [])
          .controller('davidCtrl', function() {})
          .value('david', 3);
      });
      stats.module.should.eql(['david']);
    });
  });

  describe('when angular module is set to a variable', function() {
    it('should work for a simple case', function() {
      var stats = generateStats(function () {
        var app = angular.module('david', []);
        app.controller('davidCtrl', function() {});
      });

      stats.module.length.should.equal(1);
      stats.controller.length.should.equal(1);
    });

    it('should work even when chained', function() {
      var stats = generateStats(function () {
        var app = angular.module('david', []);
        app.controller('davidCtrl', function() {})
          .value('david', 3);
      });

      stats.module.length.should.equal(1);
      stats.controller.length.should.equal(1);
      stats.value.should.eql(['david']);
    });

  });

});