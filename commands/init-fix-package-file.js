"use strict";

const fs = require('fs');
const path = require('path');
const readPackageFile = require('../helper/readPackageFile');

const MUST_HAVE_SECTIONS = {
  scripts: {
    init: 'jbn init',
    docs: 'jbn docs',
    form: 'jbn form',
    lint: 'jbn lint',
    test: 'jbn test'
  },
  devDependencies: {
    jbn: 'latest'
  }
};

module.exports = function (config)
{
  console.log('Patching package.json');

  const sections = JSON.parse(JSON.stringify(MUST_HAVE_SECTIONS));
  
  if (config.include)
  {
    config.include.forEach(include => sections.scripts.init += ` -i ${include}`)
  }
  
  if (config.include && config.include.indexOf('babel') !== -1)
  {
    sections.scripts.comp = 'jbn comp'
  }
  
  if (isNodeProject(config.projectDirectory))
  {
    let package_ = readPackageFile(config.projectDirectory);
    for (const section in sections)
    {
      if (!package_[section])
      {
        package_[section] = {};
      }
      for (let subsection in sections[section])
      {
        package_[section][subsection] = sections[section][subsection];
      }
    }
    writePackageFile(config.projectDirectory, package_);
  }
};

function isNodeProject(dir)
{
  return fs.existsSync(path.join(dir, 'package.json'));
}

function writePackageFile(dir, package_)
{
  return fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(package_, null, 2));
}
