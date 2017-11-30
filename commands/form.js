const alias = require('../helper/alias');
const find = require('../helper/find');
const run = require('../helper/run');

module.exports.command = 'frmt';
module.exports.aliases = alias('format');
module.exports.desc = 'format source code';

module.exports.handler = config =>
{
  for (let file of find(config.sourceDirectory))
  {
    run(config, `${config.bin('js-beautify')}`, `--config`, `${config.configDirectory}/js-beautify.json`, `-r`, `-f`, `${file}`);
  }
};
