"use strict";

function alias(command)
{
  let aliases = [];
  for (let x = 1; x <= command.length; x++)
  {
    aliases.push(command.substr(0, x));
  }
  return aliases;
}

module.exports = alias;
