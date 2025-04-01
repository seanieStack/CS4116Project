import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/auth/nextjs/currentUser';
import logger from '@/util/logger';

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ user: null });
        }

        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            profile_img: user.profile_img || user.logo || null,
            created_at: user.created_at
        };

        return NextResponse.json({ user: safeUser });
    } catch (error) {
        logger.error('Error retrieving current user:', error);
        return NextResponse.json({ error: 'Failed to retrieve user information' }, { status: 500 });
    }
}