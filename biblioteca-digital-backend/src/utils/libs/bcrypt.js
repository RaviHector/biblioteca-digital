import bcrypt from 'bcrypt';

export async function hashPassword(password) {
  const SALT_FACTOR = 10;

  console.log('Hashing password:', {
    receivedPassword: !!password,
    passwordLength: password?.length
  });

  const salt = await bcrypt.genSalt(SALT_FACTOR);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log('Password hashed:', {
    hashedPasswordLength: hashedPassword?.length
  });

  return hashedPassword;
}

export async function comparePasswords(password, hash) {
  console.log('Comparing in bcrypt:', {
    receivedPassword: !!password,
    receivedHash: !!hash,
    passwordLength: password?.length,
    hashLength: hash?.length
  });

  return bcrypt.compare(password, hash);
}
