import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req, { params }) {
    const { id } = await params;

    try {
        const service = await prisma.service.findUnique({
            where: { id },
            include: {
                Order: true,
                Review: true,
                Conversation: true
            }
        });

        if (!service) {
            return NextResponse.json(
                { success: false, error: "Service not found" },
                { status: 404 }
            );
        }

        await prisma.$transaction(async (prisma) => {
            await prisma.order.deleteMany({
                where: { productId: id }
            });

            await prisma.review.deleteMany({
                where: { serviceId: id }
            });

            const conversations = await prisma.conversation.findMany({
                where: { serviceId: id }
            });

            for (const conversation of conversations) {
                await prisma.message.deleteMany({
                    where: { conversationId: conversation.id }
                });
            }

            await prisma.conversation.deleteMany({
                where: { serviceId: id }
            });

            await prisma.service.delete({
                where: { id }
            });
        });

        return NextResponse.json({
            success: true,
            message: "Service and all related records successfully deleted"
        });
    } catch (err) {
        logger.error("Failed to delete service:", err);
        return NextResponse.json(
            { success: false, error: "Failed to delete service" },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    const { id } = await params;
    const { name, description, price, image, businessId } = await req.json();

    try {
        const updated = await prisma.service.update({
            where: {
                id: id
            },
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
                businessId,
            },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error("Update failed:", err);
        return NextResponse.json(
            { error: "Failed to update service" },
            { status: 500 }
        );
    }
}