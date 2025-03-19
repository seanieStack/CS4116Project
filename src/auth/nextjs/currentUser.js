"use server";

import {cookies} from "next/headers";
import {cache} from "react";
import {getSession, getUserFromSession} from "@/auth/core/session";

export const getCurrentSessionInfo = cache(async () => {
    try {
        const session = await getSession(await cookies());

        if (session) {
            console.log(`Retrieved session for user ID: ${session.targetId}, role: ${session.role}`);
        }

        return session;
    } catch (error) {
        console.error(`Error retrieving current session: ${error.message}`);
        return null;
    }
});

export const getCurrentUser = cache(async () => {
    try {
        const session = await getCurrentSessionInfo();

        if (!session) {
            return null;
        }

        const user = await getUserFromSession(session);

        if (user) {
            console.log(`Retrieved user with ID: ${user.id}, role: ${session.role}`);
        } else {
            console.warn(`Session exists for target ID ${session.targetId}, but no corresponding user found`);
        }

        return user;
    } catch (error) {
        console.error(`Error retrieving current user: ${error.message}`);
        return null;
    }
});

