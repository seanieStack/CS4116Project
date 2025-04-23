import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getCurrentSessionInfo, getCurrentUser } from "@/auth/nextjs/currentUser";
import logger from "@/util/logger";

export async function POST(request) {
    try {
        const session = await getCurrentSessionInfo();
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'You must be logged in to send a message' },
                { status: 401 }
            );
        }

        const { conversationId, content } = await request.json();

        if (!conversationId || !content) {
            return NextResponse.json(
                { error: 'Conversation ID and message content are required' },
                { status: 400 }
            );
        }

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId }
        });

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            );
        }

        if (session.role === 'BUYER' && conversation.buyerId !== user.id) {
            return NextResponse.json(
                { error: 'You do not have permission to send messages in this conversation' },
                { status: 403 }
            );
        } else if (session.role === 'BUSINESS' && conversation.businessId !== user.id) {
            return NextResponse.json(
                { error: 'You do not have permission to send messages in this conversation' },
                { status: 403 }
            );
        }

        const message = await prisma.message.create({
            data: {
                content: content,
                conversationId: conversationId,
                senderId: user.id,
                senderType: session.role === 'BUYER' ? 'BUYER' : 'BUSINESS'
            }
        });

        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updated_at: new Date() }
        });

        logger.log(`Message sent in conversation ${conversationId} by ${user.id}`);

        return NextResponse.json({
            success: true,
            message: message
        });

    } catch (error) {
        logger.error('Error sending message:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const user = await getCurrentUser();
        const session = await getCurrentSessionInfo();

        if (!user) {
            return NextResponse.json(
                { error: 'You must be logged in to view messages' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get('conversationId');

        if (!conversationId) {
            return NextResponse.json(
                { error: 'Conversation ID is required' },
                { status: 400 }
            );
        }

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId }
        });

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            );
        }

        if (session.role === 'BUYER' && conversation.buyerId !== user.id) {
            return NextResponse.json(
                { error: 'You do not have permission to view these messages' },
                { status: 403 }
            );
        } else if (session.role === 'BUSINESS' && conversation.businessId !== user.id) {
            return NextResponse.json(
                { error: 'You do not have permission to view these messages' },
                { status: 403 }
            );
        }

        const messages = await prisma.message.findMany({
            where: { conversationId: conversationId },
            orderBy: { created_at: 'asc' }
        });

        if (session.role === 'BUYER') {
            await prisma.message.updateMany({
                where: {
                    conversationId: conversationId,
                    senderType: 'BUSINESS',
                    read: false
                },
                data: { read: true }
            });
        } else if (session.role === 'BUSINESS') {
            await prisma.message.updateMany({
                where: {
                    conversationId: conversationId,
                    senderType: 'BUYER',
                    read: false
                },
                data: { read: true }
            });
        }

        const conversationDetails = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        profile_img: true
                    }
                },
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
                }
            }
        });

        return NextResponse.json({
            conversation: conversationDetails,
            messages: messages
        });

    } catch (error) {
        logger.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}