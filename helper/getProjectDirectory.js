"use strict";

const path = require('path');
const isProjectDirectory = require('./isProjectDirectory');

function getProjectDirectory(projectDirectory = process.cwd())
{
  let iterations = 10;
  while (!isProjectDirectory(projectDirectory) && iterations-- > 0)
  {
    projectDirectory = path.dirname(projectDirectory);
  }
  if (!isProjectDirectory(projectDirectory))
  {
    return false;
  }
  return projectDirectory;
}

module.exports = getProjectDirectory;
