import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        const deleted = await prisma.service.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, deleted });
    } catch (err) {
        console.error("Failed to delete service:", err);
        return NextResponse.json(
            { success: false, error: "Failed to delete service" },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { name, description, price, image, businessId } = await req.json();

    try {
        const updated = await prisma.service.update({
            where: { id },
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