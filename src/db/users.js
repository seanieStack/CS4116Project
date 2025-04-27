export async function getNewUsersLastYear() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const newBuyers = await prisma.buyer.count({
        where: {
            created_at: {
                gte: oneYearAgo,
            },
        },
    });

    const newBusinesses = await prisma.business.count({
        where: {
            created_at: {
                gte: oneYearAgo,
            },
        },
    });

    return (newBuyers + newBusinesses);

}