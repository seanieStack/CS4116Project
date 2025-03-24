import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(request) {
    try {
        const {name, description, price, image, businessId} = await request.json();

        const service = await prisma.service.create({
            data: {
                name: name,
                description: description,
                price: parseFloat(price),
                image: image,
                businessId: businessId
            }
        })
        return NextResponse.json({
            success: true,
            service
        });

    } catch (e) {
        console.log(e);
        return NextResponse.json({
            success: false,
            error: e.message
        }, {status: 500});
    }
}
