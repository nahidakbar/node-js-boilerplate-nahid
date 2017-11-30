const fs = require('fs');
const path = require('path');
const run = require('../helper/run');
const alias = require('../helper/alias');
const readPackageFile = require('../helper/readPackageFile');

module.exports.command = 'docs';
module.exports.aliases = alias('documentation');
module.exports.desc = 'produce esdoc documentation';

module.exports.handler = config =>
{
  run(config, `${config.bin('esdoc')}`, `-c`, `${config.configDirectory}/esdoc.json`);
  
  if (fs.existsSync(path.join(config.projectDirectory, 'doc')))
  {
    run(config, `cp`, `-ru`, config.projectDirectory + '/' + 'doc', config.projectDirectory + '/' + 'node_docs');
  }

  let pkg = readPackageFile(config.projectDirectory);

  if (pkg.apidoc)
  {
    run(config, `${config.bin('apidoc')}`, `-i`, `${config.sourceDirectory}`, `-o`, `${config.projectDirectory}/node_docs/api`);
    run(config, `${config.bin('apidoc-swagger')}`, `-i`, `${config.sourceDirectory}`, `-o`, `${config.projectDirectory}/node_docs/api`);
  }
};
