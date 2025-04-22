import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const filters = searchParams.get('filters');
        const sort = searchParams.get('sort');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');

        let where = {};
        let orderBy = { created_at: 'desc' };

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } }
            ];
        }

        if (filters) {
            const filtersArray = filters.split(',');
            where.AND = filtersArray.map(filter => ({
                OR: [
                    { name: { contains: filter } },
                    { description: { contains: filter } }
                ]
            }));
        }

        if (minPrice || maxPrice) {
            where.price = {};

            if (minPrice) {
                where.price.gte = parseFloat(minPrice);
            }

            if (maxPrice) {
                where.price.lte = parseFloat(maxPrice);
            }
        }

        if (sort) {
            switch (sort) {
                case 'price_asc':
                    orderBy = { price: 'asc' };
                    break;
                case 'price_desc':
                    orderBy = { price: 'desc' };
                    break;
                case 'rating':
                    orderBy = { rating: 'desc' };
                    break;
                default:
                    orderBy = { created_at: 'desc' };
            }
        }

        const services = await prisma.service.findMany({
            where,
            orderBy,
            include: {
                business: true
            }
        });

        return NextResponse.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}