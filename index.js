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


function merge(source, target) {
  var merged = Object.assign(
    {},
    target,
    source
  );
  // sort
  return Object.keys(merged).sort().reduce((sorted, key) => {
    sorted[key] = merged[key];
    return sorted;
  }, {});
}

if(sourcePackage.dependencies) {
  targetPackage.dependencies = merge(
    sourcePackage.dependencies,
    targetPackage.dependencies
  );
};

if(sourcePackage.devDependencies) {
  targetPackage.devDependencies = merge(
    sourcePackage.devDependencies,
    targetPackage.devDependencies
  );
};

if(sourcePackage.peerDependencies) {
  targetPackage.peerDependencies = merge(
    sourcePackage.peerDependencies,
    targetPackage.peerDependencies
  );
};

jsonfile.writeFileSync(targetPath, targetPackage, {spaces: 2});
