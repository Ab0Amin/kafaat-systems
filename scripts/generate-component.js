const { execSync } = require('child_process');
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('❌ Please provide a component name.');
  process.exit(1);
}

const componentName = args[0];
const command = `npx nx g @nx/next:component apps/frontend-hr-core/src/components/${componentName}/${componentName}  --style=scss `;

console.log(`🚀 Generating component: ${componentName}`);
execSync(command, { stdio: 'inherit' });
