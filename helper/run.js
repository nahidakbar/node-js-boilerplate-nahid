"use strict";

const child_process = require('child_process');
const chalk = require('chalk');

function run(config, cmd, ...params)
{
  params = params.filter(param => param !== undefined)
  const stdio = [0, 1, 2];
  const cwd = config.projectDirectory;
  const env = JSON.parse(JSON.stringify(process.env));
  env.NODE_PATH = env.NODE_PATH || '';
  env.NODE_PATH += config.sourceDirectory + ':' + config.nodeDirectory;
  console.log(chalk.bold(`# Running ${cmd} ${params.join(' ')}`));
  const ret = child_process.spawnSync(cmd, params, {
    stdio,
    cwd,
    env
  });
  if (ret.status !== 0)
  {
    console.log(chalk.bold(chalk.red('FAILURE')));
    //process.exit(1);
    throw new Error('FAILED')
  }
  else
  {
    console.log(chalk.bold(chalk.green('SUCCESS')));
  }
}

module.exports = run;
