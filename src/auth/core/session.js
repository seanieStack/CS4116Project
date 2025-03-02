"use server"

import {cookies} from "next/headers";
import {prisma} from "@/lib/prisma";
import crypto from 'crypto';

export async function createUserSession(user) {
    const sessionId = crypto.randomBytes(256).toString("hex").normalize();

    await prisma.session.create({
        data: {
            sessionId: sessionId,
            userId: user.id,
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 7)
        }
    });

    const cookie = await cookies();

    cookie.set("sessionId", sessionId, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 7),
            sameSite: "lax",
            secure: true,
            httpOnly: true
        }
    );
}

async function getUserSessionById(sessionId) {
    const user = await prisma.session.findUnique({
        where: {
            sessionId: sessionId
        }
    });

    if (!user) return null;

    return user;
}

export async function getUserFromSession(cookie) {
    const sessionId = cookie.get("sessionId")?.value;

    if (!sessionId) return null;

    return getUserSessionById(sessionId);
}