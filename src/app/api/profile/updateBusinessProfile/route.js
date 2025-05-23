import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import logger from "@/util/logger";

export async function POST(request) {
    logger.log("Received business profile update request");

    try {
        const { id, name, bio, profileImage } = await request.json();

        if (!id) {
            logger.warn("Business update rejected: Missing business ID");
            return NextResponse.json(
                { message: "Business ID is required" },
                { status: 400 }
            );
        }

        logger.log(`Processing business update for ID: ${id}, name: ${name}, bio: ${bio ? "Provided" : "Not provided"}, logo: ${profileImage ? "Provided" : "Not provided"}`);

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.description = bio;
        if (profileImage !== undefined) updateData.logo = profileImage;

        if (Object.keys(updateData).length === 0) {
            logger.warn(`Business update rejected: No fields to update for business ${id}`);
            return NextResponse.json(
                { message: "No update data provided" },
                { status: 400 }
            );
        }

        const existingBusiness = await prisma.business.findUnique({
            where: { id }
        });

        if (!existingBusiness) {
            logger.warn(`Business update failed: Business with ID ${id} not found`);
            return NextResponse.json(
                { message: "Business not found" },
                { status: 404 }
            );
        }

        const updatedBusiness = await prisma.business.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                description: true,
                logo: true,
                created_at: true,
                updated_at: true
            }
        });

        logger.log(`Business ${id} updated successfully`);

        return NextResponse.json({
            message: "Business profile updated successfully",
            business: updatedBusiness
        });
    } catch (error) {
        if (error.code === 'P2025') {
            logger.error(`Business update failed: Business not found`, error);
            return NextResponse.json(
                { message: "Business not found" },
                { status: 404 }
            );
        }

        logger.error(`Business update failed with error:`, {
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        return NextResponse.json(
            { message: "Failed to update business profile" },
            { status: 500 }
        );
    }
}