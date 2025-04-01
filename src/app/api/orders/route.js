import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import logger from "@/util/logger";

export async function POST(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'You must be logged in to place an order' },
                { status: 401 }
            );
        }

        const { serviceId, businessId } = await request.json();

        if (!serviceId || !businessId) {
            return NextResponse.json(
                { error: 'Service ID and Business ID are required' },
                { status: 400 }
            );
        }

        const service = await prisma.service.findFirst({
            where: {
                id: serviceId,
                businessId: businessId
            }
        });

        if (!service) {
            return NextResponse.json(
                { error: 'Service not found or does not belong to the specified business' },
                { status: 404 }
            );
        }

        const existingOrder = await prisma.order.findFirst({
            where: {
                customerId: user.id,
                productId: serviceId
            }
        });

        if (existingOrder) {
            return NextResponse.json(
                { message: 'You have already purchased this service', orderId: existingOrder.id },
                { status: 200 }
            );
        }

        const order = await prisma.order.create({
            data: {
                customerId: user.id,
                businessId: businessId,
                productId: serviceId
            }
        });

        logger.log(`Order created: ${order.id} for service ${serviceId} by user ${user.id}`);

        return NextResponse.json({
            success: true,
            message: 'Order placed successfully',
            orderId: order.id
        });
    } catch (error) {
        logger.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'You must be logged in to view orders' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (userId && userId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'You do not have permission to view these orders' },
                { status: 403 }
            );
        }

        const where = userId ? { customerId: userId } : { customerId: user.id };

        const orders = await prisma.order.findMany({
            where,
            include: {
                product: true,
                business: {
                    select: {
                        id: true,
                        name: true,
                        logo: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return NextResponse.json({ orders });
    } catch (error) {
        logger.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}