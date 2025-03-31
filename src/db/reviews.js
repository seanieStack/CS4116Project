import {getCurrentSessionInfo, getCurrentUser} from "@/auth/nextjs/currentUser";

export async function getAverageRatingForBusiness() {
    const session = await getCurrentSessionInfo();
    const user = await getCurrentUser();

    if (!session || session.role !== "BUSINESS") return 0;

    const result = await prisma.review.aggregate({
        where: {
            businessId: user.id,
        },
        _avg: {
            rating: true,
        },
    });

    return result._avg.rating ?? 0;
}