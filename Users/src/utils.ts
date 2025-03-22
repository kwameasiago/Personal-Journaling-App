import * as bcrypt from 'bcryptjs';

/**
 * Hashes a plaintext password using bcrypt.
 *
 * @param {string} password - The plaintext password to hash.
 * @param {number} [saltRounds=10] - The number of salt rounds to use. Defaults to 10.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string, saltRounds: number = 10): Promise<string> {
    const salt = bcrypt.genSaltSync(saltRounds)
    return await bcrypt.hashSync(password, salt);
}

/**
 * Compares a plaintext password with a hashed password to check for a match.
 *
 * @param {string} password - The plaintext password to verify.
 * @param {string} hashedPassword - The bcrypt hashed password.
 * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}
