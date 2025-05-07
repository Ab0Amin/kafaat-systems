// hash-password.ts
import bcrypt from 'bcrypt';

async function hashPassword(password) {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
}

// Example usage
const password = process.argv[2]; // Get from command line

if (!password) {
  console.error('❌ Please provide a password:');
  console.error('Usage: ts-node hash-password.ts mypassword123');
  process.exit(1);
}

hashPassword(password).then(hash => {
  console.log('🔐 Hashed password:');
  console.log(hash);
});
