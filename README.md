# copy-dependencies

Command line utility to copy the dependencies from one node package to another.

Updates the package.json file in the target folder to include the values of dependencies, peerDependencies and devDependencies from the package.json in the source folder. Does not copy any files across.

## Usage

```
npm install copy-dependencies -g
copy-dependencies ./path/to/source ./path/to/target
```
