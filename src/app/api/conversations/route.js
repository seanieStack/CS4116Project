import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import logger from "@/util/logger";

export async function POST(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'You must be logged in to start a conversation' },
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

        let conversation = await prisma.conversation.findFirst({
            where: {
                buyerId: user.id,
                businessId: businessId,
                serviceId: serviceId
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    buyerId: user.id,
                    businessId: businessId,
                    serviceId: serviceId
                }
            });
            logger.log(`New conversation created: ${conversation.id} for service ${serviceId}`);
        }

        return NextResponse.json({
            success: true,
            conversation: conversation
        });

    } catch (error) {
        logger.error('Error creating conversation:', error);
        return NextResponse.json(
            { error: 'Failed to create conversation' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'You must be logged in to view conversations' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        let conversations;

        if (role === 'business') {
            conversations = await prisma.conversation.findMany({
                where: {
                    businessId: user.id
                },
                include: {
                    buyer: {
                        select: {
                            id: true,
                            name: true,
                            profile_img: true
                        }
                    },
                    service: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    messages: {
                        orderBy: {
                            created_at: 'desc'
                        },
                        take: 1
                    }
                },
                orderBy: {
                    updated_at: 'desc'
                }
            });
        } else {
            conversations = await prisma.conversation.findMany({
                where: {
                    buyerId: user.id
                },
                include: {
                    business: {
                        select: {
                            id: true,
                            name: true,
                            logo: true
                        }
                    },
                    service: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    messages: {
                        orderBy: {
                            created_at: 'desc'
                        },
                        take: 1
                    }
                },
                orderBy: {
                    updated_at: 'desc'
                }
            });
        }

        return NextResponse.json({ conversations });

    } catch (error) {
        logger.error('Error fetching conversations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conversations' },
            { status: 500 }
        );
    }
}