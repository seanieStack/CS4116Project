import {NextResponse} from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, name, profileImage } = body;

        if (!id) {
            return NextResponse.json(
                {message: "User ID is required"},
                {status: 400}
            );
        }

        const updatedUser = await prisma.buyer.update({
            where: {
                id: id
            },
            data: {
                name: name,
                profile_img: profileImage,
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