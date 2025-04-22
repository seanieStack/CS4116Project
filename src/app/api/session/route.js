import { NextResponse } from 'next/server';
import { getCurrentSessionInfo } from "@/auth/nextjs/currentUser";
import logger from "@/util/logger";

export async function GET() {
    try {
        const session = await getCurrentSessionInfo();

        if (!session) {
            return NextResponse.json({ session: null });
        }

        const safeSession = {
            id: session.id,
            role: session.role,
            targetType: session.targetType
        };

        return NextResponse.json({ session: safeSession });
    } catch (error) {
        logger.error('Error retrieving session:', error);
        return NextResponse.json({ error: 'Failed to retrieve session information' }, { status: 500 });
    }
}