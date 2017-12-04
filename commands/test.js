const run = require('../helper/run');
const alias = require('../helper/alias');
const find = require('../helper/find');
const createBadge = require('../helper/createBadge');
const fs = require('fs');
const path = require('path');
const libCoverage = require('nyc/node_modules/istanbul-lib-coverage');

module.exports.command = 'test';
module.exports.aliases = alias('test');
module.exports.desc = 'run mocha test cases';

module.exports.builder = {
  bail: {
    alias: 'b',
    default: false
  }
};

module.exports.handler = config =>
{
  //~ run(config, `${config.bin('nyc')}`, `--temp-directory`, `node_coverage`, `-a`, `-x`, `node_*`, `-x`, `**/*Test*.js`, `-s`, `${config.bin('mocha')}`, `-b`, `**/*Test.js`);
  // above does not work when you use process.exit() in one of your test scripts or have too many test cases etc.
  // probably bugs in mocha
  // so below, we try to run tests individually
  // and then combine coverage across all test runs
  // it is much slower but well, dont have time to waste on debugging this...
  // this is based on https://gist.github.com/rundef/22545366591d73330a48b8948fa060a7
  let coverage = null;
  let failed = false;
  for (let file of find(config.sourceDirectory, /Test.js$/))
  {
    try
    {
      run(config, `${config.bin('nyc')}`, `--temp-directory`, `node_coverage`, `-a`, `-c`, `-x`, `node_*`, `-x`, `lib`, `-x`, `**/*Test*.js`, `-s`, `${config.bin('mocha')}`, `--exit`, `-b`, `${file}`);
    }
    catch(e)
    {
      if (config.bail)
      {
        throw e;
      }
      else
      {
        failed = e;
      }
    }
    for (let file of fs.readdirSync(path.join(config.projectDirectory, 'node_coverage')))
    {
      const covPath = path.join(config.projectDirectory, 'node_coverage', file);
      const map = libCoverage.createCoverageMap(JSON.parse(fs.readFileSync(covPath, 'utf8')));
      if (coverage !== null)
      {
        coverage.merge(map);
      }
      else
      {
        coverage = map;
      }
      fs.unlinkSync(covPath);
    }
  }

  //~ // collate coverage files into one
  //~ let coverage = null;
  //~ for (let file of fs.readdirSync(path.join(config.projectDirectory, 'node_coverage')))
  //~ {
    //~ const covPath = path.join(config.projectDirectory, 'node_coverage', file);
    //~ const map = libCoverage.createCoverageMap(JSON.parse(fs.readFileSync(covPath, 'utf8')));
    //~ if (coverage !== null)
    //~ {
      //~ coverage.merge(map);
    //~ }
    //~ else
    //~ {
      //~ coverage = map;
    //~ }
    //~ fs.unlinkSync(covPath);
  //~ }


  if (coverage)
  {
    fs.writeFileSync(path.join(config.projectDirectory, 'node_coverage', 'coverage-final.json'), JSON.stringify(coverage.toJSON()));

    // write html reports
    run(config, `${config.bin('nyc')}`, '--temp-directory', `node_coverage`, '--report-dir', `node_docs/coverage`, `-r`, `html`, `report`);

    // produce badges
    let summary = libCoverage.createCoverageSummary();
    coverage.files().forEach(function (f) {
        const fc = coverage.fileCoverageFor(f),
        s = fc.toSummary();
        summary.merge(s);
    });

    createBadge('statement coverage', summary.statements, `node_docs/coverage/statements.svg`);
    createBadge('function coverage', summary.functions, `node_docs/coverage/functions.svg`);
    createBadge('branch coverage', summary.branches, `node_docs/coverage/branches.svg`);
    createBadge('line coverage', summary.lines, `node_docs/coverage/lines.svg`);
    createBadge('github', 'public', `node_docs/coverage/public.svg`);
    createBadge('github', 'private', `node_docs/coverage/private.svg`);

    // insead of printing output on each run, we produce one report at the end
    run(config, `${config.bin('nyc')}`, '--temp-directory', `node_coverage`, `report`);

    // check combined coverage
    run(config, `${config.bin('nyc')}`, '--temp-directory', 'node_coverage', `check-coverage`, `--lines`, `80`, `--functions`, `80`, `--branches`, `80`);
    if (failed)
    {
      throw failed;
    }
  }
  else
  {
    console.log(`No tests found.`);
  }
};
