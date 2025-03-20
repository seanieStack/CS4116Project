import crypto from 'crypto';
import logger from "@/util/logger";

/**
 * Hashes a password using crypto.scrypt with the provided salt.
 *
 * This function normalizes the input password before hashing to ensure
 * consistent results across different text representations. The final hash
 * is also normalized and converted to a hexadecimal string.
 *
 * @function hashPassword
 * @param {string} password - The password to hash (required)
 * @param {string} salt - The salt to use in the hashing process (required)
 * @returns {Promise<string>} A promise that resolves to the hexadecimal string representation of the hashed password
 *
 * @throws {Error} If any error occurs during the hashing process
 */
export function hashPassword(password, salt) {

    if (!password) {
        logger.error('Password hashing failed: No password provided');
        return Promise.reject(new Error('Password is required'));
    }

    if (!salt) {
        logger.error('Password hashing failed: No salt provided');
        return Promise.reject(new Error('Salt is required'));
    }

    return new Promise((resolve, reject) => {
        try {
            crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
                if (error) {
                    logger.error(`Password hashing failed: ${error.message}`);
                    reject(error);
                    return;
                }

                try {
                    const hashedPassword = hash.toString('hex').normalize();
                    resolve(hashedPassword);
                } catch (stringifyError) {
                    logger.error(`Error converting hash to string: ${stringifyError.message}`);
                    reject(stringifyError);
                }
            });
        } catch (cryptoError) {
            logger.error(`Unexpected error during password hashing: ${cryptoError.message}`);
            reject(cryptoError);
        }
    });
}

/**
 * Generates a random cryptographic salt for password hashing.
 *
 * Creates a 16-byte random buffer using crypto.randomBytes and
 * converts it to a normalized hexadecimal string. This function
 * is typically used in conjunction with hashPassword().
 *
 * @function generateSalt
 * @returns {string} A 32-character hexadecimal string representing the salt,
 *                   or an empty string if an error occurs
 *
 * @throws {Error} The function catches all errors internally and returns an empty string,
 *                 but logs the error message to the console
 */
export function generateSalt() {
    try {
        return crypto.randomBytes(16).toString('hex').normalize();
    } catch (error) {
        logger.error(`Salt generation failed: ${error.message}`);
        return '';
    }
}

/**
 * Securely compares a stored password hash with a newly hashed password attempt.
 *
 * Uses the same salt and hashing process to hash the attempted password,
 * then performs a timing-safe comparison to prevent timing attacks.
 * This function returns false for any error condition to prevent
 * information leakage.
 *
 * @async
 * @function comparePassword
 * @param {string} hashedPassword - The stored hashed password to compare against
 * @param {string} attemptedPassword - The plaintext password being attempted
 * @param {string} salt - The salt that was used to hash the stored password
 * @returns {Promise<boolean>} True if passwords match, false otherwise or if any error occurs
 *
 *
 * @throws {Error} The function catches all errors internally and returns false,
 *                 but logs the error message to the console
 */
export async function comparePassword(hashedPassword, attemptedPassword, salt) {
    if (!hashedPassword || !attemptedPassword || !salt) {
        logger.error('Password comparison failed: Missing required parameters');
        return false;
    }

    try {
        const hashedAttemptedPassword = await hashPassword(attemptedPassword, salt);

        return crypto.timingSafeEqual(
            Buffer.from(hashedPassword, "hex"),
            Buffer.from(hashedAttemptedPassword, "hex")
        );
    } catch (error) {
        logger.error(`Password comparison failed: ${error.message}`);
        return false;
    }
}