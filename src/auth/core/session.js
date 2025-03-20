"use server"

import {cookies} from "next/headers";
import {prisma} from "@/lib/prisma";
import crypto from 'crypto';
import logger from "@/util/logger";

/**
 * Creates an authenticated session for a user.
 *
 * Generates a cryptographically secure session ID, creates a session record in the database,
 * and sets a secure HTTP-only cookie with the session information. The session is valid
 * for approximately 7 months (30 * 7 days).
 *
 * @async
 * @function createUserSession
 * @param {Object} user - The user object for whom to create a session
 * @param {number} user.id - The unique identifier of the user
 * @param {string} role - The user's role (e.g., "BUYER", "BUSINESS", "ADMIN")
 * @returns {Promise<boolean>} True if session creation was successful
 *
 *
 * @throws {Error} If user is invalid or missing an ID
 * @throws {Error} If role is not provided
 * @throws {Error} If the session creation process fails
 */
export async function createUserSession(user, role) {
    if (!user || !user.id) {
        logger.error("Session creation failed: Invalid user");
        throw new Error("Invalid user object");
    }

    if (!role) {
        logger.error("Session creation failed: Role is required");
        throw new Error("Role is required");
    }

    let sessionId;
    try {
        sessionId = crypto.randomBytes(256).toString("hex").normalize();
    } catch (error) {
        logger.error(`Session ID generation failed: ${error.message}`);
        return false;
    }

    const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 7);

    try {
        await prisma.session.create({
            data: {
                sessionId: sessionId,
                role: role,
                targetType: role,
                targetId: user.id,
                expires_at: expiryDate
            }
        });

        const cookie = await cookies();
        cookie.set("sessionId", sessionId, {
            expires: expiryDate,
            sameSite: "lax",
            secure: true,
            httpOnly: true
        });

        logger.log(`Session created successfully for user ${user.id} with role ${role}`);
        return true;
    } catch (error) {
        logger.error(`Failed to create session: ${error.message}`);
        throw new Error("Session creation failed");
    }
}

/**
 * Retrieves a session from the database by its ID and checks if it's still valid.
 *
 * Fetches the session record with the provided sessionId, checks if it has expired,
 * automatically removes expired sessions from the database, and returns either
 * the valid session or null.
 *
 * @async
 * @function getSessionById
 * @param {string} sessionId - The unique identifier of the session to retrieve
 * @returns {Promise<Object|null>} The session object if found and valid, or null if:
 *   - sessionId is null/undefined
 *   - No session exists with the provided ID
 *   - The session has expired (and is automatically deleted)
 *   - An error occurs during retrieval
 *
 *
 * @throws {Error} The function catches all errors internally and returns null,
 *                 but logs the error message to the console
 */
async function getSessionById(sessionId) {
    if (!sessionId) {
        logger.warn("Attempted to get session with null/undefined sessionId");
        return null;
    }

    try {
        const session = await prisma.session.findUnique({
            where: {
                sessionId: sessionId
            }
        });

        if (session && session.expires_at && new Date(session.expires_at) < new Date()) {
            logger.log(`Session ${sessionId.substring(0, 8)}... has expired`);
            try {
                await prisma.session.delete({
                    where: { sessionId: sessionId }
                });
            } catch (cleanupError) {
                logger.warn(`Failed to clean up expired session: ${cleanupError.message}`);
            }

            return null;
        }

        return session;
    } catch (error) {
        logger.error(`Error retrieving session ${sessionId.substring(0, 8)}...: ${error.message}`);
        return null;
    }
}

/**
 * Retrieves the current user session from a cookie.
 *
 * Extracts the sessionId from the provided cookie object and uses it
 * to fetch the corresponding session record from the database. This function
 * serves as a wrapper around getSessionById, handling the cookie extraction logic.
 *
 * @async
 * @function getSession
 * @param {Object} cookie - The cookie object from which to extract the sessionId
 * @returns {Promise<Object|null>} The session object if found and valid, or null if:
 *   - cookie is null/undefined
 *   - No sessionId cookie exists
 *   - No session exists with the extracted ID
 *   - The session has expired
 *   - An error occurs during retrieval
 *
 *
 * @throws {Error} The function catches all errors internally through getSessionById and returns null,
 *                 but logs error messages to the console
 */
export async function getSession(cookie) {
    if (!cookie) {
        logger.warn("Attempted to get session with null/undefined cookie");
        return null;
    }

    const sessionId = cookie.get("sessionId")?.value;

    if (!sessionId) {
        return null;
    }

    return getSessionById(sessionId);
}

/**
 * Retrieves a user object based on session information.
 *
 * Looks up the appropriate user record (buyer, business, or admin) based on
 * the role and targetId stored in the session.
 *
 * @async
 * @function getUserFromSession
 * @param {Object} session - The session object containing user identification information
 * @param {string} session.role - The role of the user ("BUYER", "BUSINESS", or "ADMIN")
 * @param {string} session.targetType - The type of user account
 * @param {string|number} session.targetId - The unique identifier of the user
 * @returns {Promise<Object|null>} The user object if found, or null if:
 *   - session is null/undefined
 *   - session is missing required fields
 *   - role type is unknown
 *   - no user matches the provided targetId
 *   - an error occurs during retrieval
 *
 *
 * @throws {Error} The function catches all errors internally and returns null,
 *                 but logs the error message to the console
 */
export async function getUserFromSession(session) {
    if (!session) {
        return null;
    }

    if (!session.role || !session.targetType || !session.targetId) {
        logger.warn(`Invalid session format: missing role, targetType or targetId`);
        return null;
    }

    try {
        let user = null;

        switch (session.role) {
            case "BUYER":
                user = await prisma.buyer.findUnique({
                    where: { id: session.targetId }
                });
                break;
            case "BUSINESS":
                user = await prisma.business.findUnique({
                    where: { id: session.targetId }
                });
                break;
            case "ADMIN":
                user = await prisma.admin.findUnique({
                    where: { id: session.targetId }
                });
                break;
            default:
                logger.warn(`Unknown role type: ${session.role}`);
                return null;
        }

        if (!user) {
            logger.warn(`User not found for session with targetId: ${session.targetId}`);
        }

        return user;
    } catch (error) {
        logger.error(`Error retrieving user from session: ${error.message}`);
        return null;
    }
}

/**
 * Removes a user session by deleting the session record and clearing the session cookie.
 *
 * Extracts the sessionId from the provided cookie object, deletes the corresponding
 * session record from the database, and removes the sessionId cookie from the client.
 * The function attempts to delete the cookie even if the database operation fails.
 *
 * @async
 * @function removeUserSession
 * @param {Object} cookie - The cookie object containing the sessionId to remove
 * @returns {Promise<void>} This function doesn't return a value
 *
 *
 * @throws {Error} The function catches all errors internally and logs them to console,
 *                 continuing with cookie deletion even if database operations fail
 */
export async function removeUserSession(cookie) {
    if (!cookie) {
        logger.warn("Attempted to remove session with null/undefined cookie");
        return;
    }

    const sessionId = cookie.get("sessionId")?.value;

    if (!sessionId) {
        return;
    }

    try {
        await prisma.session.delete({
            where: {
                sessionId: sessionId
            }
        });

        cookie.delete("sessionId");
        logger.log(`Session ${sessionId.substring(0, 8)}... removed successfully`);
    } catch (error) {
        logger.error(`Failed to remove session: ${error.message}`);
        try {
            cookie.delete("sessionId");
        } catch (cookieError) {
            logger.error(`Failed to delete session cookie: ${cookieError.message}`);
        }
    }
}