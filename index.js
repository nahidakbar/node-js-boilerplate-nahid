#!/usr/bin/env node

"use strict";

const fs = require('fs');
const path = require('path');
const getProjectDirectory = require('./helper/getProjectDirectory');

/**
 * Load command module and monkey patch to do some validation.
 */
function load(modpath)
{
  let command = require(modpath);

  let handler = command.handler;

  command.handler = config =>
  {
    if (!config.projectDirectory)
    {
      console.log(`No project found.`);
      process.exit(1);
    }
    config.sourceDirectory = path.join(config.projectDirectory, 'src')
    if (!fs.existsSync(config.sourceDirectory))
    {
      config.sourceDirectory = config.projectDirectory
    }
    console.log(`Found node project at ${config.projectDirectory}.`);

    config.binDirectories = [
      path.join(__dirname, 'node_modules', '.bin'),
      config.nodeDirectory = path.join(__dirname, '..', '.bin')
    ];

    config.nodeDirectory = path.join(__dirname, 'node_modules');
    if (!fs.existsSync(config.nodeDirectory) || !fs.existsSync(config.nodeDirectory + '/.bin'))
    {
      config.nodeDirectory = path.join(__dirname, '..');
    }
    
    config.bin = function(bin)
    {
      for (let dir of config.binDirectories)
      {
        if (fs.existsSync(path.join(dir, bin)))
        {
          return path.join(dir, bin);
        }
      }
      throw new Error(`${bin} not found`);
    }
    
    return handler(config);
  };

  return command;
}

const config = require('yargs')
  .command(load('./commands/comp'))
  .command(load('./commands/docs'))
  .command(load('./commands/form'))
  .command(load('./commands/init'))
  .command(load('./commands/lint'))
  .command(load('./commands/test'))
  .demandCommand()
  .option('projectDirectory', {
    alias: 'p',
    default: getProjectDirectory()
  })
  .option('configDirectory', {
    alias: 'c',
    default: path.join(__dirname, 'config')
  })
  .help()
  .completion()
  .argv;
