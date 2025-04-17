const { execSync } = require('child_process');
const path = require('path');
const name = process.argv[2];

if (!name) {
  console.log('❌ Please provide a resource name.');
  process.exit(1);
}

// full path to the Nest app directory inside NX workspace
const nestAppPath = path.resolve(__dirname, '../apps/hr-core-server');

// NOTE: remove --type and --crud for compatibility with older Nest CLI
const command = `nest g resource modules/${name}`;

console.log(`🚀 Generating resource: ${name} inside hr-core-server`);
execSync(command, {
  stdio: 'inherit',
  cwd: nestAppPath,
});
