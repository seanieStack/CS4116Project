"use server"

import {cookies} from "next/headers";
import {prisma} from "@/lib/prisma";
import crypto from 'crypto';

export async function createUserSession(user, role) {
    if (!user || !user.id) {
        console.error("Session creation failed: Invalid user");
        throw new Error("Invalid user object");
    }

    if (!role) {
        console.error("Session creation failed: Role is required");
        throw new Error("Role is required");
    }

    let sessionId;
    try {
        sessionId = crypto.randomBytes(256).toString("hex").normalize();
    } catch (error) {
        console.error(`Session ID generation failed: ${error.message}`);
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

        console.log(`Session created successfully for user ${user.id} with role ${role}`);
        return true;
    } catch (error) {
        console.error(`Failed to create session: ${error.message}`);
        throw new Error("Session creation failed");
    }
}


async function getSessionById(sessionId) {
    if (!sessionId) {
        console.warn("Attempted to get session with null/undefined sessionId");
        return null;
    }

    try {
        const session = await prisma.session.findUnique({
            where: {
                sessionId: sessionId
            }
        });

        if (session && session.expires_at && new Date(session.expires_at) < new Date()) {
            console.log(`Session ${sessionId.substring(0, 8)}... has expired`);
            try {
                await prisma.session.delete({
                    where: { sessionId: sessionId }
                });
            } catch (cleanupError) {
                console.warn(`Failed to clean up expired session: ${cleanupError.message}`);
            }

            return null;
        }

        return session;
    } catch (error) {
        console.error(`Error retrieving session ${sessionId.substring(0, 8)}...: ${error.message}`);
        return null;
    }
}

export async function getSession(cookie) {
    if (!cookie) {
        console.warn("Attempted to get session with null/undefined cookie");
        return null;
    }

    const sessionId = cookie.get("sessionId")?.value;

    if (!sessionId) {
        return null;
    }

    return getSessionById(sessionId);
}

export async function getUserFromSession(session) {
    if (!session) {
        return null;
    }

    if (!session.role || !session.targetType || !session.targetId) {
        console.warn(`Invalid session format: missing role, targetType or targetId`);
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
                console.warn(`Unknown role type: ${session.role}`);
                return null;
        }

        if (!user) {
            console.warn(`User not found for session with targetId: ${session.targetId}`);
        }

        return user;
    } catch (error) {
        console.error(`Error retrieving user from session: ${error.message}`);
        return null;
    }
}

export async function removeUserSession(cookie) {
    if (!cookie) {
        console.warn("Attempted to remove session with null/undefined cookie");
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
        console.log(`Session ${sessionId.substring(0, 8)}... removed successfully`);
    } catch (error) {
        console.error(`Failed to remove session: ${error.message}`);
        try {
            cookie.delete("sessionId");
        } catch (cookieError) {
            console.error(`Failed to delete session cookie: ${cookieError.message}`);
        }
    }
}