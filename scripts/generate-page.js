const { execSync } = require('child_process');
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('❌ Please provide a page name.');
  process.exit(1);
}

const pageName = args[0];

// استخدم اسم المشروع بالظبط زي ما ظهر
const command = `npx nx g @nx/next:page  apps/hr-core-client/src/app/${pageName} --style=scss `;

console.log(`🚀 Generating page: ${pageName}`);
execSync(command, { stdio: 'inherit' });
