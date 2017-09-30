'use strict';

const stream = require('stream');
const fixtures = require('./fixtures');
const format = require('../format');

/**
 * Returns a new writeable stream with the specified write function.
 * @param {function} write Write function for the specified stream
 * @returns {stream.Writeable} A writeable stream instance
 */
exports.writeable = function (write) {
  return new stream.Writable({
    objectMode: true,
    write: write
  });
};

/**
 * Simple test helper which creates an instance
 * of the `colorize` format and asserts that the
 * correct `info` object was processed.
 */
exports.assumeFormatted = function (format, info, assertion) {
  return function (done) {
    var writeable = exports.writeable(function (info) {
      assertion(info);
      done();
    });

    writeable.write(format.transform(info, format.options));
  };
};

/*
 * Set of simple format functions that illustrate
 * expected, edge, and corner cases.
 */
exports.formatFns = {
  identity(info) {
    return info;
  },

  assign(info) {
    return Object.assign({}, info);
  },

  ignore(info) {
    return false;
  },

  invalid(just, too, many, args) {
    return just;
  }
};

/*
 * Create a set of actual formats based on the formatFns.
 * This is very useful in upstream tests.
 */
exports.formats = Object.keys(exports.formatFns)
  .filter(name => !['invalid'].includes(name))
  .reduce((acc, name) => {
    const formatFn = exports.formatFns[name];
    acc[name] = format(formatFn);

    return acc;
  }, {});
