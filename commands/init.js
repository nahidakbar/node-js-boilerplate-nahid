const alias = require('../helper/alias');

module.exports.command = 'init';
module.exports.aliases = alias('initialise');
module.exports.desc = 're-initialise project directory';
module.exports.builder = {
  include: {
    alias: 'i',
    array: true
  }
}

module.exports.handler = config =>
{
  [
    './init-fix-gitignore-file',
    './init-fix-package-file'
  ].forEach(cmd => require(cmd)(config));
};
