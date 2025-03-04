"use server";

import {cookies} from "next/headers";
import {cache} from "react";
import {getSession, getUserFromSession} from "@/auth/core/session";

export const getCurrentSessionInfo = cache(
    async () => {
        return await getSession(await cookies())
    }
)

export const getCurrentUser = cache(
    async () => {
        return await getUserFromSession(await getCurrentSessionInfo())
    }
)

