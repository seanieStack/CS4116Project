import {NextResponse} from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, name, bio, profileImage } = body;

        if (!id) {
            return NextResponse.json(
                {message: "User ID is required"},
                {status: 400}
            );
        }

        const updatedUser = await prisma.business.update({
            where: {
                id: id
            },
            data: {
                name: name,
                description: bio,
                logo: profileImage,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json(
            {message: "Internal Server Error"},
            {status: 500}
        );
    }
}