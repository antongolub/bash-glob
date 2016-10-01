'use strict';

var cwd = process.cwd();
var path = require('path');
var assert = require('assert');
var fixtures = path.join(__dirname, 'fixtures');
var glob = require('..');

describe('changing cwd and searching for **/d', function() {
  before(function(cb) {
    process.chdir(fixtures);
    cb();
  });

  after(function(cb) {
    process.chdir(cwd);
    cb();
  });

  describe('cwd globbing', function() {
    it('no matches', function(cb) {
      glob('fofofooffo/alalal/**/d', function(err, files) {
        if (err) return cb(err);
        assert.deepEqual(files, []);
        cb();
      });
    });

    it('.', function(cb) {
      glob('**/d', function(err, files) {
        if (err) return cb(err);
        assert.deepEqual(files, ['a/b/c/d', 'a/c/d']);
        cb();
      });
    });

    it('a', function(cb) {
      glob('**/d', {cwd: path.resolve('a')}, function(err, files) {
        if (err) return cb(err);
        assert.deepEqual(files, ['b/c/d', 'c/d']);
        cb();
      });
    });

    it('a/b', function(cb) {
      glob('**/d', {cwd: path.resolve('a/b')}, function(err, files) {
        if (err) return cb(err);
        assert.deepEqual(files, ['c/d']);
        cb();
      });
    });

    it('a/b/', function(cb) {
      glob('**/d', {cwd: path.resolve('a/b/')}, function(err, files) {
        if (err) return cb(err);
        assert.deepEqual(files, ['c/d']);
        cb();
      });
    });

    it('.', function(cb) {
      glob('**/d', {cwd: process.cwd()}, function(err, files) {
        if (err) return cb(err);
        assert.deepEqual(files, ['a/b/c/d', 'a/c/d']);
        cb();
      });
    });
  });

  describe('non-dir cwd should raise error', function() {
    var notdir = 'a/b/c/d';
    var expected = 'cwd is not a directory: ' + notdir;

    it('sync', function(cb) {
      try {
        glob.sync('*', {cwd: notdir});
        cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, expected);
        cb();
      }
    });

    it('async', function(cb) {
      glob('*', {cwd: notdir}, function(err, results) {
        assert.equal(err.message, expected);
        cb();
      });
    });
  });
});

