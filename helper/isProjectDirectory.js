"use strict";

const fs = require('fs');
const path = require('path');

function isProjectDirectory(projectDirectory)
{
  return fs.existsSync(path.join(projectDirectory, 'package.json'));
}

module.exports = isProjectDirectory;
