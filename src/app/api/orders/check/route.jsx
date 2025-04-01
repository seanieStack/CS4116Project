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
                return NextResponse.json({ hasPurchased: false });
            }

            targetUserId = currentUser.id;
        }

        const order = await prisma.order.findFirst({
            where: {
                customerId: targetUserId,
                productId: serviceId
            }
        });

        logger.log(`Checked purchase for serviceId ${serviceId} by userId ${targetUserId}: ${!!order}`);

        return NextResponse.json({ hasPurchased: !!order });
    } catch (error) {
        logger.error('Error checking order:', error);
        return NextResponse.json(
            { error: 'Failed to check purchase history', hasPurchased: false },
            { status: 500 }
        );
    }
}