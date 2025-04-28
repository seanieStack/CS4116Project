import {getCurrentSessionInfo, getCurrentUser} from "@/auth/nextjs/currentUser";
import {prisma} from "@/lib/prisma";

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
        }, 0)
}

export async function getTotalSales() {
    const orders = await prisma.order.findMany({
        include: {
            product: true,
        },
    });

    return orders.reduce((sum, order) => {
        return sum + (order.product.price || 0);
    }, 0);
}

export async function getAverageTransactionsPerDay() {
    const orders = await prisma.order.findMany({
        orderBy: {
            created_at: 'asc',
        },
    });

    if (orders.length === 0) {
        return 0;
    }

    const totalTransactions = orders.length;

    const firstOrderDate = orders[0].created_at;
    const now = new Date();

    const diffInDays = Math.max(
        Math.floor((now.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24)),
        1
    );

    return totalTransactions / diffInDays;

}