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


function sort(merged) {
  return Object.keys(merged).sort().reduce((sorted, key) => {
    sorted[key] = merged[key];
    return sorted;
  }, {});
}

function merge(target, source) {
  return Object.assign(
    {},
    target,
    source
  );
}

function logChanges(merged, target, pkgKey) {
  var changes = Object.keys(merged).reduce((acc, key) => {
    if(merged[key] != target[key]) {
      acc[key] = merged[key];
    }
    return acc;
  }, {});

  var maxLength = Object.keys(changes).reduce((acc, key) => Math.max(key.length, acc), 0);

  if(Object.keys(changes).length) {
    console.log();
    console.log(pkgKey);
    Object.keys(changes).forEach(key => {
      if(merged[key] && target[key] && (merged[key] !== target[key])) {
        console.warn(`${key.padStart(maxLength)}: ${target[key]} => ${merged[key]}`)
      } else if (merged[key] && !target[key]) {
        console.warn(`${key.padStart(maxLength)}: => ${merged[key]}`)
      }
    });
  }
}

function processDependencies(sourcePkg, targetPkg, key) {
  var source = sourcePkg[key];
  var target = targetPkg[key];

  var merged = merge(target, source);
  var sorted = sort(merged, source);

  logChanges(sorted, target, key);

  // sort
  return sorted;
}



if(sourcePackage.dependencies) {
  targetPackage.dependencies = processDependencies(
    sourcePackage,
    targetPackage,
    'dependencies'
  );
};

if(sourcePackage.devDependencies) {
  targetPackage.devDependencies = processDependencies(
    sourcePackage,
    targetPackage,
    'devDependencies'
  );
};

if(sourcePackage.peerDependencies) {
  targetPackage.peerDependencies = processDependencies(
    sourcePackage,
    targetPackage,
    'peerDependencies'
  );
};

jsonfile.writeFileSync(targetPath, targetPackage, {spaces: 2});
