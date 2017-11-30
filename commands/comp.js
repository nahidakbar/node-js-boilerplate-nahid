const alias = require('../helper/alias');
const find = require('../helper/find');
const run = require('../helper/run');

module.exports.command = 'comp';
module.exports.aliases = alias('compile');
module.exports.desc = 'compile es6+ source into es5 lib folder';
module.exports.builder = {
  watch: {
    alias: 'w',
    default: false
  },
  bundle: {
    alias: 'b',
  }
};

module.exports.handler = config =>
{
  const watch = (config.watch? `--watch` : undefined);
  run(config, `${config.bin('babel')}`, `--presets`, `latest`, `--plugins`, `transform-runtime`, config.sourceDirectory, `--out-dir`, `${config.projectDirectory}/lib`, watch);
  if (config.bundle)
  {
    run(config, `${config.bin('browserify')}`, `-e`, `${config.projectDirectory}/lib/index.js`, `-s`, config.bundle, `-o`, `${config.projectDirectory}/lib/${config.bundle}.js`);
  }
};
