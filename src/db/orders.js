import {getCurrentSessionInfo, getCurrentUser} from "@/auth/nextjs/currentUser";

export async function getTotalOrdersForBusiness() {
    const session = await getCurrentSessionInfo();
    const user = await getCurrentUser();

    if (!session || session.role !== "BUSINESS") return 0;

    return await prisma.order.count({
        where: {
            businessId: user.id,
        },
    });
}

export async function getProfitForBusiness() {
    const session = await getCurrentSessionInfo();
    const user = await getCurrentUser();
    if (!session || session.role !== "BUSINESS") return 0;
    const orders = await prisma.order.findMany({
        where: {
            businessId: user.id,
        },
        include: {
            product: true,
        },
    });

    return orders.reduce((sum, order) => {
        return sum + (order.product?.price || 0);
    }, 0);
}