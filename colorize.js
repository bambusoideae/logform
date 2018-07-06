'use strict';

const chalk = require('chalk');
const { LEVEL } = require('triple-beam');

/**
 * @property {RegExp} hasSpace
 * Simple regex to check for presence of spaces.
 */
const hasSpace = /\s+/;

/*
 * Colorizer format. Wraps the `level` and/or `message` properties
 * of the `info` objects with ANSI color codes based on a few options.
 */
class Colorizer {
  constructor(opts = {}) {
    if (opts.colors) {
      this.addColors(opts.colors);
    }

    this.options = opts;
  }

  /*
   * Adds the colors Object to the set of allColors
   * known by the Colorizer
   *
   * @param {Object} colors Set of color or format function mappings to add.
   */
  static addColors(colors) {
    const nextColors = Object.keys(colors).reduce((acc, level) => {
      if (typeof colors[level] === 'function') {
        acc[level] = colors[level];
      } else if (Array.isArray(colors[level])) {
        acc[level] = chalk;

        for (let i = 0; i < colors[level].length; i++) {
          acc[level] = acc[level][colors[level][i]];
        }
      } else if (hasSpace.test(colors[level])) {
        const formatChain = colors[level].split(hasSpace);
        acc[level] = chalk;

        for (let i = 0; i < formatChain.length; i++) {
          acc[level] = acc[level][formatChain[i]];
        }
      } else {
        acc[level] = chalk[colors[level]];
      }

      return acc;
    }, {});

    Colorizer.allColors = Object.assign({}, Colorizer.allColors || {}, nextColors);
    return Colorizer.allColors;
  }

  /*
   * Adds the colors Object to the set of allColors
   * known by the Colorizer
   *
   * @param {Object} colors Set of color mappings to add.
   */
  addColors(colors) {
    return Colorizer.addColors(colors);
  }

  /*
   * function colorize (lookup, level, message)
   * Performs colorization using Colorizer.allColors
   */
  colorize(lookup, level, message) {
    if (typeof message === 'undefined') {
      message = level;
    }

    return Colorizer.allColors[lookup](message);
  }

  /*
   * function transform (info, opts)
   * Attempts to colorize the { level, message } of the given
   * `logform` info object.
   */
  transform(info, opts) {
    if (opts.level || opts.all || !opts.message) {
      info.level = this.colorize(info[LEVEL], info.level);
    }

    if (opts.all || opts.message) {
      info.message = this.colorize(info[LEVEL], info.level, info.message);
    }

    return info;
  }
}

/*
 * function colorize (info)
 * Returns a new instance of the colorize Format that applies
 * level colors to `info` objects. This was previously exposed
 * as { colorize: true } to transports in `winston < 3.0.0`.
 */
module.exports = (opts) => new Colorizer(opts);

//
// Attach the Colorizer for registration purposes
//
module.exports.Colorizer = Colorizer;
module.exports.Format = Colorizer;
