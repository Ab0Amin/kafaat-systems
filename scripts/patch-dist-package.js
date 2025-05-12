const fs = require('fs');
const path = require('path');

const rootPkgPath = path.resolve(__dirname, '../package.json');
const distPkgPath = path.resolve(__dirname, '../apps/hr-core-server/dist/package.json');

//  read files
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const distPkg = JSON.parse(fs.readFileSync(distPkgPath, 'utf8'));

//  current deps
const rootDeps = rootPkg.dependencies || {};
const rootDevDeps = rootPkg.devDependencies || {};
const distDeps = distPkg.dependencies || {};

const mergedDeps = { ...distDeps };
const mergedDevDeps = {};

//  list of modules you want to make sure they are included
const mustInclude = ['typeorm', '@nestjs/typeorm', 'pg'];

//  copy missing dependencies
for (const dep of mustInclude) {
  if (rootDeps[dep]) {
    mergedDeps[dep] = rootDeps[dep];
  } else if (rootDevDeps[dep]) {
    mergedDevDeps[dep] = rootDevDeps[dep];
  } else {
    console.warn(`⚠️ dependency "${dep}" not found in root package.json`);
  }
}

//  write back to dist package.json
const updatedPkg = {
  ...distPkg,
  dependencies: mergedDeps,
  devDependencies: mergedDevDeps,
};

fs.writeFileSync(distPkgPath, JSON.stringify(updatedPkg, null, 2), 'utf8');
console.log(' dist package.json updated with required dependencies.');
