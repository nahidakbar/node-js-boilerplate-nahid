"use strict";

const fs = require('fs');
const path = require('path');

function readPackageFile(projectDirectory)
{
  return JSON.parse(fs.readFileSync(path.join(projectDirectory, 'package.json')));
}

module.exports = readPackageFile;
