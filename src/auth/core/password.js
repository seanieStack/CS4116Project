import crypto from 'crypto';

export function hashPassword(password, salt) {

    if (!password) {
        console.error('Password hashing failed: No password provided');
        return Promise.reject(new Error('Password is required'));
    }

    if (!salt) {
        console.error('Password hashing failed: No salt provided');
        return Promise.reject(new Error('Salt is required'));
    }

    return new Promise((resolve, reject) => {
        try {
            crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
                if (error) {
                    console.error(`Password hashing failed: ${error.message}`);
                    reject(error);
                    return;
                }

                try {
                    const hashedPassword = hash.toString('hex').normalize();
                    resolve(hashedPassword);
                } catch (stringifyError) {
                    console.error(`Error converting hash to string: ${stringifyError.message}`);
                    reject(stringifyError);
                }
            });
        } catch (cryptoError) {
            console.error(`Unexpected error during password hashing: ${cryptoError.message}`);
            reject(cryptoError);
        }
    });
}

export function generateSalt() {
    try {
        return crypto.randomBytes(16).toString('hex').normalize();
    } catch (error) {
        console.error(`Salt generation failed: ${error.message}`);
        return '';
    }
}

export async function comparePassword(hashedPassword, attemptedPassword, salt) {
    if (!hashedPassword || !attemptedPassword || !salt) {
        console.error('Password comparison failed: Missing required parameters');
        return false;
    }

    try {
        const hashedAttemptedPassword = await hashPassword(attemptedPassword, salt);

        return crypto.timingSafeEqual(
            Buffer.from(hashedPassword, "hex"),
            Buffer.from(hashedAttemptedPassword, "hex")
        );
    } catch (error) {
        console.error(`Password comparison failed: ${error.message}`);
        return false;
    }
}