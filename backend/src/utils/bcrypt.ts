import bcrypt from 'bcrypt';

async function hashString(toHash: string): Promise<string> {
  return bcrypt.hash(toHash, 10);
}

async function validateHashedString(toValidate: string, hashed: string) {
  return bcrypt.compare(toValidate, hashed);
}

export { hashString, validateHashedString };
