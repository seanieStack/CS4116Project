import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/auth/nextjs/currentUser';
import logger from '@/util/logger';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const serviceId = searchParams.get('serviceId');
        const userId = searchParams.get('userId');

        if (!serviceId) {
            return NextResponse.json(
                { error: 'Service ID is required' },
                { status: 400 }
            );
        }

        let targetUserId = userId;

        if (!targetUserId) {
            const currentUser = await getCurrentUser();

            if (!currentUser) {
                return NextResponse.json({ hasReviewed: false });
            }

            targetUserId = currentUser.id;
        }

        const review = await prisma.review.findFirst({
            where: {
                customerId: targetUserId,
                serviceId: serviceId
            }
        });

        logger.log(`Checked review for serviceId ${serviceId} by userId ${targetUserId}: ${!!review}`);

        return NextResponse.json({ hasReviewed: !!review });
    } catch (error) {
        logger.error('Error checking review:', error);
        return NextResponse.json(
            { error: 'Failed to check review history', hasReviewed: false },
            { status: 500 }
        );
    }
}