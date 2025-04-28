import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/auth/nextjs/currentUser';
import logger from '@/util/logger';

export async function POST(request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'You must be logged in to submit a review' },
                { status: 401 }
            );
        }

        const { businessId, serviceId, comment, rating } = await request.json();

        if (!businessId || !serviceId || rating === undefined) {
            return NextResponse.json(
                { error: 'Business ID, Service ID, and Rating are required' },
                { status: 400 }
            );
        }

        const numericRating = parseInt(rating, 10);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        const service = await prisma.service.findFirst({
            where: {
                id: serviceId,
                businessId: businessId
            }
        });

        if (!service) {
            return NextResponse.json(
                { error: 'Service not found or does not belong to the specified business' },
                { status: 404 }
            );
        }

        const order = await prisma.order.findFirst({
            where: {
                customerId: user.id,
                productId: serviceId
            }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'You must purchase this service before reviewing it' },
                { status: 403 }
            );
        }

        const existingReview = await prisma.review.findFirst({
            where: {
                customerId: user.id,
                serviceId: serviceId
            }
        });

        if (existingReview) {
            return NextResponse.json(
                { error: 'You have already reviewed this service' },
                { status: 400 }
            );
        }

        const review = await prisma.$transaction(async (prisma) => {
            const newReview = await prisma.review.create({
                data: {
                    rating: numericRating,
                    comment: comment || null,
                    customerId: user.id,
                    businessId: businessId,
                    serviceId: serviceId
                }
            });

            const allReviews = await prisma.review.findMany({
                where: {
                    serviceId: serviceId
                },
                select: {
                    rating: true
                }
            });

            const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

            await prisma.service.update({
                where: { id: serviceId },
                data: {
                    rating: averageRating
                }
            });

            return newReview;
        });

        logger.log(`Review created: ${review.id} for service ${serviceId} by user ${user.id}`);

        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully',
            review: {
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                created_at: review.created_at
            }
        });
    } catch (error) {
        logger.error('Error creating review:', error);
        return NextResponse.json(
            { error: 'Failed to submit review' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const serviceId = searchParams.get('serviceId');

        if (!serviceId) {
            return NextResponse.json(
                { error: 'Service ID is required' },
                { status: 400 }
            );
        }

        const reviews = await prisma.review.findMany({
            where: {
                serviceId: serviceId
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        profile_img: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            select: { rating: true }
        });

        return NextResponse.json({
            reviews,
            averageRating: service?.rating || 0,
            totalReviews: reviews.length
        });
    } catch (error) {
        logger.error('Error fetching reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}