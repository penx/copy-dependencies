#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var commander = require('commander');
var jsonfile = require('jsonfile')
var { version } = require('./package.json')

commander
  .version(version)
  .usage('<source> <target>')
  .parse(process.argv);

if (commander.args.length < 2) {
  console.error('Usage: copy-dependencies <source> <target>');
  return;
}

var sourcePath = path.join(process.cwd(), commander.args[0], 'package.json');
var targetPath = path.join(process.cwd(), commander.args[1], 'package.json');

var sourcePackage = jsonfile.readFileSync(sourcePath);
var targetPackage = jsonfile.readFileSync(targetPath);

targetPackage.dependencies = Object.assign(
  {},
  sourcePackage.dependencies,
  targetPackage.dependencies
);

targetPackage.devDependencies = Object.assign(
  {},
  sourcePackage.devDependencies,
  targetPackage.devDependencies
);

targetPackage.peerDependencies = Object.assign(
  {},
  sourcePackage.devDependencies,
  targetPackage.devDependencies
);

jsonfile.writeFileSync(targetPath, targetPackage);
