'use strict';

const assume = require('assume');
const chalk = require('chalk');
const { configs, LEVEL } = require('triple-beam');
const colorize = require('../colorize');
const Colorizer = colorize.Colorizer;
const {
  assumeHasPrototype,
  assumeFormatted,
  infoify,
  setupLevels
} = require('./helpers');

describe('colorize', () => {
  before(setupLevels);

  it('colorize() (default)', assumeFormatted(
    colorize(),
    infoify({ level: 'info', message: 'whatever' }),
    info => {
      assume(info.level).is.a('string');
      assume(info.message).is.a('string');
      assume(info.level).equals(chalk.green('info'));
      assume(info.message).equals('whatever');
    }
  ));

  it('colorize({ level: true })', assumeFormatted(
    colorize({ level: true }),
    infoify({ level: 'info', message: 'whatever' }),
    info => {
      assume(info.level).is.a('string');
      assume(info.message).is.a('string');
      assume(info.level).equals(chalk.green('info'));
      assume(info.message).equals('whatever');
    }
  ));

  it('colorize{ message: true })', assumeFormatted(
    colorize({ message: true }),
    infoify({ level: 'info', message: 'whatever' }),
    info => {
      assume(info.level).is.a('string');
      assume(info.message).is.a('string');
      assume(info.level).equals('info');
      assume(info.message).equals(chalk.green('whatever'));
    }
  ));

  it('colorize({ level: true, message: true })', assumeFormatted(
    colorize({ level: true, message: true }),
    infoify({ level: 'info', message: 'whatever' }),
    info => {
      assume(info.level).is.a('string');
      assume(info.message).is.a('string');
      assume(info.level).equals(chalk.green('info'));
      assume(info.message).equals(chalk.green('whatever'));
    }
  ));

  it('colorize({ all: true })', assumeFormatted(
    colorize({ all: true }),
    infoify({ level: 'info', message: 'whatever' }),
    info => {
      assume(info.level).is.a('string');
      assume(info.message).is.a('string');
      assume(info.level).equals(chalk.green('info'));
      assume(info.message).equals(chalk.green('whatever'));
    }
  ));

  it('colorizes when LEVEL !== level', assumeFormatted(
    colorize(),
    { [LEVEL]: 'info', level: 'INFO', message: 'whatever' },
    info => {
      assume(info.level).is.a('string');
      assume(info.message).is.a('string');
      assume(info.level).equals(chalk.green('INFO'));
    }
  ));
});

describe('Colorizer', () => {
  const expected = Object.assign({},
    configs.cli.colors,
    configs.npm.colors,
    configs.syslog.colors);

  before(setupLevels);

  it('exposes the Format prototype', assumeHasPrototype(colorize));

  it('Colorizer.addColors({ string: string })', () => {
    Colorizer.addColors({ weird: 'cyan' });

    assume(Colorizer.allColors).deep.equals(
      Object.assign({}, expected, { weird: 'cyan' })
    );
  });

  it('Colorizer.addColors({ string: [Array] })', () => {
    Colorizer.addColors({ multiple: ['red', 'bold'] });
    assume(Colorizer.allColors.multiple).is.an('array');
    assume(Colorizer.allColors.multiple).deep.equals(['red', 'bold']);
  });

  // eslint-disable-next-line no-useless-escape
  it('Colorizer.addColors({ string: "(\w+)/s(\w+)" })', () => {
    Colorizer.addColors({ delimited: 'blue underline' });
    assume(Colorizer.allColors.delimited).deep.equals(['blue', 'underline']);
  });

  it('Colorizer.addColors({ function: function (message) })', () => {
    Colorizer.addColors({ multiple: ['red', 'bold'] });
    assume(Colorizer.allColors.multiple).is.an('array');
    assume(Colorizer.allColors.multiple).deep.equals(['red', 'bold']);
  });

  describe('#colorize(LEVEL, level, message)', () => {
    const instance = new Colorizer();

    it('colorize(level) [single color]', () => {
      assume(instance.colorize('weird', 'weird')).equals(chalk.cyan('weird'));
    });

    it('colorize(level) [multiple colors]', () => {
      assume(instance.colorize('multiple', 'multiple')).equals(
        chalk.bold(chalk.red('multiple'))
      );
    });

    it('colorize(level, message) [single color]', () => {
      assume(instance.colorize('weird', 'weird', 'message')).equals(chalk.cyan('message'));
    });

    it('colorize(level, message) [multiple colors]', () => {
      assume(instance.colorize('multiple', 'multiple', 'message')).equals(
        chalk.bold(chalk.red('message'))
      );
    });
  });
});
