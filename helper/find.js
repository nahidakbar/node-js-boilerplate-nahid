"use strict";

const fs = require('fs');
const path = require('path');

function* find(parent, pattern = /\.js$/, ignore = /(\/node_|\/test)/g)
{
  for (let file of fs.readdirSync(parent))
  {
    let fullPath = path.join(parent, file);
    if (fullPath.match(ignore))
    {
      continue;
    }
    if (fullPath.match(pattern))
    {
      yield fullPath;
    }
    else if (fs.lstatSync(fullPath)
      .isDirectory(fullPath))
    {
      for (let sub of find(fullPath, pattern, ignore))
      {
        yield sub;
      }
    }
  }
}

module.exports = find;
