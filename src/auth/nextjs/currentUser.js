"use server";

import {cookies} from "next/headers";
import {cache} from "react";
import {getSession, getUserFromSession} from "@/auth/core/session";
import logger from "@/util/logger";

/**
 * Retrieves the current session info from cookies
 *
 * @async
 * @function getCurrentSessionInfo
 * @returns {Promise<Object|null>} A promise that resolves to the session object if found,
 *                                 or null if no session exists or an error occurs
 *
 * @throws {Error} Catches errors internally and returns null
 */
export const getCurrentSessionInfo = cache(async () => {
    try {
        const session = await getSession(await cookies());

        if (session) {
            logger.log(`Retrieved session for user ID: ${session.targetId}, role: ${session.role}`);
        }

        return session;
    } catch (error) {
        logger.error(`Error retrieving current session: ${error.message}`);
        return null;
    }
});

/**
 * Retrieves the currently authenticated user based on session info
 *
 * @async
 * @function getCurrentUser
 * @returns {Promise<Object|null>} A promise that resolves to the user object if found, or null if:
 *   - No valid session exists
 *   - No user is associated with the session
 *   - An error occurs during retrieval
 *
 *
 * @throws {Error} Catches errors internally and returns null
 */
export const getCurrentUser = cache(async () => {
    try {
        const session = await getCurrentSessionInfo();

        if (!session) {
            return null;
        }

        const user = await getUserFromSession(session);

        if (user) {
            logger.log(`Retrieved user with ID: ${user.id}, role: ${session.role}`);
        } else {
            logger.warn(`Session exists for target ID ${session.targetId}, but no corresponding user found`);
        }

        return user;
    } catch (error) {
        logger.error(`Error retrieving current user: ${error.message}`);
        return null;
    }
});

