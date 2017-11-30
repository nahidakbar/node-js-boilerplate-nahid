const alias = require('../helper/alias');
const run = require('../helper/run');

module.exports.command = 'lint';
module.exports.aliases = alias('lint');
module.exports.desc = 'run eslint lint tests';

module.exports.handler = config =>
{
  run(config, `${config.bin('eslint')}`, `-c`, `${config.configDirectory}/eslint.json`, config.sourceDirectory, `--ignore-pattern`, `node_*`, `--ignore-pattern`, `*Test*.js`, `--fix`)
};
