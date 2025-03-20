import {NextResponse} from "next/server";
import logger from "@/util/logger";

export async function POST(request) {
    logger.log("Received user update request");

    try {
        const { id, name, profileImage } = await request.json();

        if (!id) {
            logger.warn("User update rejected: Missing user ID");
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        logger.log(`Processing user update for ID: ${id}, name: ${name}, profile image: ${profileImage ? "Provided" : "Not provided"}`);

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (profileImage !== undefined) updateData.profile_img = profileImage;

        if (Object.keys(updateData).length === 0) {
            logger.warn(`User update rejected: No fields to update for user ${id}`);
            return NextResponse.json(
                { message: "No update data provided" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.buyer.findUnique({
            where: { id }
        });

        if (!existingUser) {
            logger.warn(`User update failed: User with ID ${id} not found`);
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const updatedUser = await prisma.buyer.update({
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

        logger.log(`User ${id} updated successfully`);

        return NextResponse.json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        if (error.code === 'P2025') {
            logger.error(`User update failed: User not found`, error);
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        logger.error(`User update failed with error:`, {
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        return NextResponse.json(
            { message: "Failed to update user profile" },
            { status: 500 }
        );
    }
}