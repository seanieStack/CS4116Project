import {getCurrentSessionInfo, getCurrentUser} from "@/auth/nextjs/currentUser";

export async function getAllServices() {
    return await prisma.service.findMany({
        include: {
            business: true,
        },
    });
}

export async function getServiceById(id) {
    return await prisma.service.findUnique({
        where: {
            id: id,
        },
    });
}

export async function getBusinessServices() {
    const session = await getCurrentSessionInfo();
    const user = await getCurrentUser();
    if (!session || session.role !== "BUSINESS") return [];

    return await prisma.service.findMany({
        where: {
            businessId: user.id,
        },
        orderBy: {
            created_at: "desc",
        },
    });
}