import readline from 'readline';
import bcrypt from 'bcryptjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter password to hash: ', async (password) => {
  if (password.length < 6) {
    console.log('Password must be at least 6 characters.');
    rl.close();
    process.exit(1);
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    console.log('\nHere is your bcrypt hash:\n');
    console.log(hash);
    console.log('\nCopy and paste this into the "password" field of your admin user in MongoDB.');
  } catch (err) {
    console.error('Error hashing password:', err);
  }
  rl.close();
});
