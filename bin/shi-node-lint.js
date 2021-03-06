#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')
const lint = require('../lib')

program
  .version(pkg.version)
  .option('-F, --fix', 'automatically fix problems')
  .option('--changed', 'run only on changed files')
  .parse(process.argv)

lint(program)
