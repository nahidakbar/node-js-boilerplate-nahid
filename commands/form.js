const alias = require('../helper/alias');
const find = require('../helper/find');
const run = require('../helper/run');

module.exports.command = 'frmt';
module.exports.aliases = alias('format');
module.exports.desc = 'format source code';

module.exports.handler = config =>
{
  let files = config._.slice(1);
  if (!files.length)
  {
    files = find(config.sourceDirectory);
  }
  for (let file of files)
  {
    run(config, `${config.bin('js-beautify')}`, `--config`, `${config.configDirectory}/js-beautify.json`, `-r`, `-f`, `${file}`);
  }
};
