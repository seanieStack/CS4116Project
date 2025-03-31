import { NextResponse } from "next/server";
import { getBusinessServices } from "@/db/services";
import {prisma} from "@/lib/prisma";

export async function GET() {
    try {
        const services = await getBusinessServices();

        const formatted = services.map((service) => ({
            id: service.id,
            name: service.name,
            description: service.description,
            price: service.price,
            image: service.image,
            businessId: service.businessId,
        }));
        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Failed to fetch business services:", error?.message || error || "Unknown error");
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}

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
        return NextResponse.json(service);


    } catch (e) {
        console.log(e);
        return NextResponse.json({
            success: false,
            error: e.message
        }, {status: 500});
    }
}