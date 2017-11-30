"use strict";

const fs = require('fs');
const path = require('path');

const MUST_HAVE_RULES = [
  'node_*',
  '*.log',
];

module.exports = function (config)
{
  console.log('Patching gitignore');
  if (isGitProject(config.projectDirectory))
  {
    let rules = readGitignoreFile(config.projectDirectory);
    for (const rule of MUST_HAVE_RULES)
    {
      if (rules.indexOf(rule) === -1)
      {
        rules.splice(0, 0, rule);
      }
    }
    writeGitignoreFile(config.projectDirectory, rules);
  }
};

function isGitProject(dir)
{
  return fs.existsSync(path.join(dir, '.git'));
}

function readGitignoreFile(dir)
{
  if (fs.existsSync(path.join(dir, '.gitignore')))
  {
    return fs.readFileSync(path.join(dir, '.gitignore'))
      .toString()
      .split('\n');
  }
  else
  {
    return [''];
  }
}

function writeGitignoreFile(dir, rules)
{
  return fs.writeFileSync(path.join(dir, '.gitignore'), rules.join('\n'));
}
