import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/auth/nextjs/currentUser";

export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { serviceId, businessId } = await request.json();

        const order = await prisma.order.create({
            data: {
                customerId: user.id,
                businessId: businessId,
                productId: serviceId
            }
        });

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}