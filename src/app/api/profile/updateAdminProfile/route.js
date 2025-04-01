import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import logger from "@/util/logger";

export async function POST(request) {
    logger.log("Received admin user update request");

    try {
        const { id, name, profileImage } = await request.json();

        if (!id) {
            logger.warn("admin user update rejected: Missing admin user ID");
            return NextResponse.json(
                { message: "admin user ID is required" },
                { status: 400 }
            );
        }

        logger.log(`Processing admin user update for ID: ${id}, name: ${name}, profile image: ${profileImage ? "Provided" : "Not provided"}`);

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (profileImage !== undefined) updateData.profile_img = profileImage;

        if (Object.keys(updateData).length === 0) {
            logger.warn(`admin user update rejected: No fields to update for admin user ${id}`);
            return NextResponse.json(
                { message: "No update data provided" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.admin.findUnique({
            where: { id }
        });

        if (!existingUser) {
            logger.warn(`admin user update failed: admin user with ID ${id} not found`);
            return NextResponse.json(
                { message: "admin user not found" },
                { status: 404 }
            );
        }

        const updatedUser = await prisma.admin.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                profile_img: true,
                created_at: true,
                updated_at: true
            }
        });

        logger.log(`admin user ${id} updated successfully`);

        return NextResponse.json({
            message: "admin user updated successfully",
            user: updatedUser
        });
    } catch (error) {
        if (error.code === 'P2025') {
            logger.error(`admin user update failed: admin user not found`, error);
            return NextResponse.json(
                { message: "admin user not found" },
                { status: 404 }
            );
        }

        logger.error(`admin user update failed with error:`, {
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        return NextResponse.json(
            { message: "Failed to update admin user profile" },
            { status: 500 }
        );
    }
}