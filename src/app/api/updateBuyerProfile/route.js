import {NextResponse} from "next/server";

export async function POST(request) {
    console.log("Received user update request");

    try {
        const { id, name, profileImage } = await request.json();

        if (!id) {
            console.warn("User update rejected: Missing user ID");
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        console.log(`Processing user update for ID: ${id}, name: ${name}, profile image: ${profileImage ? "Provided" : "Not provided"}`);

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (profileImage !== undefined) updateData.profile_img = profileImage;

        if (Object.keys(updateData).length === 0) {
            console.warn(`User update rejected: No fields to update for user ${id}`);
            return NextResponse.json(
                { message: "No update data provided" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.buyer.findUnique({
            where: { id }
        });

        if (!existingUser) {
            console.warn(`User update failed: User with ID ${id} not found`);
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

        console.log(`User ${id} updated successfully`);

        return NextResponse.json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        if (error.code === 'P2025') {
            console.error(`User update failed: User not found`, error);
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        console.error(`User update failed with error:`, {
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