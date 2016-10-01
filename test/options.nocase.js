'use strict';

var cwd = process.cwd();
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var mkdirp = require('mkdirp');
var del = require('delete');
var fixtures = path.join.bind(path, __dirname, 'fixtures');
var dir = fixtures('package');
var glob = require('..');

describe('options.nocase', function() {
  before(function(cb) {
    process.chdir(fixtures());
    mkdirp.sync(dir);
    fs.writeFileSync('package/package.json', '{}', 'ascii');
    fs.writeFileSync('package/README.md', 'z', 'ascii');
    fs.writeFileSync('package/README', 'x', 'ascii');
    cb();
  });

  after(function(cb) {
    process.chdir(cwd);
    del(dir, cb);
  });

  it('should match a file with no extension', function(cb) {
    var options = {cwd: dir, nocase: true};
    glob('README?(.*)', options, function(err, files) {
      if (err) return cb(err);
      assert.deepEqual(files, ['README', 'README.md']);
      cb();
    });
  });
});
