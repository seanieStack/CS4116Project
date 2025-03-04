"use server"

import {cookies} from "next/headers";
import {prisma} from "@/lib/prisma";
import crypto from 'crypto';

export async function createUserSession(user, role) {
    const sessionId = crypto.randomBytes(256).toString("hex").normalize();

    console.log("Creating session for user: ");
    console.log(user);


    await prisma.session.create({
        data: {
            sessionId: sessionId,
            role: role,
            targetType: role,
            targetId: user.id,
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

async function getSessionById(sessionId) {
    const user = await prisma.session.findUnique({
        where: {
            sessionId: sessionId
        }
    });

    if (!user) return null;

    console.log(user);

    return user;
}

export async function getSession(cookie) {
    const sessionId = cookie.get("sessionId")?.value;

    if (!sessionId) return null;

    return getSessionById(sessionId);
}

export async function getUserFromSession(session){
    if (!session) return null;

    if (!session.role || !session.targetType) return null;

    if (session.role === "BUYER"){
        return prisma.buyer.findUnique({
            where: {
                id: session.targetId
            }
        });
    }
    else if (session.role === "BUSINESS"){
        return prisma.business.findUnique({
            where: {
                id: session.targetId
            }
        });
    } else if (session.role === "ADMIN"){
        return prisma.admin.findUnique({
            where: {
                id: session.targetId
            }
        });
    }

    return null;
}

export async function removeUserSession(cookie){
    const sessionId = cookie.get("sessionId")?.value;

    if (!sessionId) return;

    await prisma.session.delete({
        where: {
            sessionId: sessionId
        }
    });

    cookie.delete("sessionId");
}