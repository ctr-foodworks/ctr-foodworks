import bcrypt from "bcryptjs";

/**
 * Generates a bcrypt hash for the single admin password. Copy the output into
 * ADMIN_PASSWORD_HASH (env).
 *
 *   npm run admin:hash -- "your-strong-password"
 */
const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run admin:hash -- "your-strong-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log(hash);
